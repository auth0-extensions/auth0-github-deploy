import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';
import GitHubApi from 'github';
import request from 'request-promise';

import config from './config';
import logger from '../lib/logger';
import * as constants from './constants';

/*
 * Check if a file is part of the rules folder.
 */
const isRule = (fileName) =>
  fileName.indexOf(`${constants.RULES_DIRECTORY}/`) === 0;

/*
 * Check if a file is part of the database folder.
 */
const isDatabaseConnection = (fileName) =>
  fileName.indexOf(`${constants.DATABASE_CONNECTIONS_DIRECTORY}/`) === 0;

/*
 * Get the details of a database file script.
 */
const getDatabaseScriptDetails = (filename) => {
  const parts = filename.split('/');
  if (parts.length === 3 && /\.js$/i.test(parts[2])) {
    const scriptName = path.parse(parts[2]).name;
    if (constants.DATABASE_SCRIPTS.indexOf(scriptName) > -1) {
      return {
        database: parts[1],
        name: path.parse(scriptName).name
      };
    }
  }

  return null;
};

/*
 * Only Javascript and JSON files.
 */
const validFilesOnly = (fileName) => {
  if (isRule(fileName)) {
    return /\.(js|json)$/i.test(fileName);
  } else if (isDatabaseConnection(fileName)) {
    const script = getDatabaseScriptDetails(fileName);
    return !!script;
  }

  return false;
};

/*
 * Get a flat list of changes and files that need to be added/updated/removed.
 */
export const hasChanges = (commits) =>
  _.chain(commits)
    .map(commit => _.union(commit.added, commit.modified, commit.removed))
    .flattenDeep()
    .uniq()
    .filter(validFilesOnly)
    .value()
    .length > 0;

/*
 * Parse the repository.
 */
const parseRepo = (repository = '') => {
  const parts = repository.split('/');
  if (parts.length === 2) {
    const [ user, repo ] = parts;
    return { user, repo };
  } else if (parts.length === 5) {
    const [ , , , user, repo ] = parts;
    return { user, repo };
  }

  throw new Error(`Invalid repository: ${repository}`);
};

/*
 * Get tree.
 */
const getTree = (repository, branch, sha) =>
  new Promise((resolve, reject) => {
    try {
      const github = new GitHubApi({
        version: '3.0.0'
      });
      github.authenticate({
        type: 'oauth',
        token: config('GITHUB_TOKEN')
      });

      const { user, repo } = parseRepo(repository);
      github.gitdata.getTree({ user, repo, sha: sha || branch, recursive: true },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          try {
            const files = res.tree
              .filter(f => f.type === 'blob')
              .filter(f => validFilesOnly(f.path));
            return resolve(files);
          } catch (mappingError) {
            return reject(mappingError);
          }
        });
    } catch (e) {
      reject(e);
    }
  });

/*
 * Download a single file.
 */
const downloadFile = (repository, branch, file) => {
  const token = config('GITHUB_TOKEN');
  const url = `https://${token}:x-oauth-basic@api.github.com/repos/${repository}/git/blobs/${file.sha}`;

  return request({ uri: url, json: true, headers: { 'user-agent': 'auth0-github-deploy' } })
    .then(blob => {
      logger.debug(`Downloaded ${file.path} (${file.sha})`);

      return {
        fileName: file.path,
        contents: (new Buffer(blob.content, 'base64')).toString()
      };
    })
    .catch(err => {
      logger.error(`Error downloading 'api.github.com/repos/${repository}/git/blobs/${file.sha}'`);
      logger.error(err);

      throw err;
    });
};

/*
 * Download a single rule with its metadata.
 */
const downloadRule = (repository, branch, ruleName, rule) => {
  const currentRule = {
    ...rule,
    name: ruleName
  };

  const downloads = [ ];

  if (rule.script) {
    downloads.push(downloadFile(repository, branch, rule.scriptFile)
      .then(file => {
        currentRule.script = file.contents;
      }));
  }

  if (rule.metadata) {
    downloads.push(downloadFile(repository, branch, rule.metadataFile)
      .then(file => {
        currentRule.metadata = JSON.parse(file.contents);
      }));
  }

  return Promise.all(downloads)
    .then(() => currentRule);
};

/*
 * Determine if we have the script, the metadata or both.
 */
const getRules = (repository, branch, files) => {
  // Rules object.
  const rules = { };

  // Determine if we have the script, the metadata or both.
  _.filter(files, f => isRule(f.path)).forEach(file => {
    const ruleName = path.parse(file.path).name;
    rules[ruleName] = rules[ruleName] || { };

    if (/\.js$/i.test(file.path)) {
      rules[ruleName].script = true;
      rules[ruleName].scriptFile = file;
    } else if (/\.json$/i.test(file.path)) {
      rules[ruleName].metadata = true;
      rules[ruleName].metadataFile = file;
    }
  });

  // Download all rules.
  return Promise.map(Object.keys(rules), (ruleName) => downloadRule(repository, branch, ruleName, rules[ruleName]), { concurrency: 2 });
};

/*
 * Download a single database script.
 */
const downloadDatabaseScript = (repository, branch, databaseName, scripts) => {
  const database = {
    name: databaseName,
    scripts: []
  };

  const downloads = [ ];
  scripts.forEach(script => {
    downloads.push(downloadFile(repository, branch, script)
      .then(file => {
        database.scripts.push({
          stage: script.name,
          contents: file.contents
        });
      })
    );
  });

  return Promise.all(downloads)
    .then(() => database);
};

/*
 * Get all database scripts.
 */
const getDatabaseScripts = (repository, branch, files) => {
  const databases = { };

  // Determine if we have the script, the metadata or both.
  _.filter(files, f => isDatabaseConnection(f.path)).forEach(file => {
    const script = getDatabaseScriptDetails(file.path);
    if (script) {
      databases[script.database] = databases[script.database] || [ ];
      databases[script.database].push({
        ...script,
        sha: file.sha,
        path: file.path
      });
    }
  });

  return Promise.map(Object.keys(databases), (databaseName) => downloadDatabaseScript(repository, branch, databaseName, databases[databaseName]), { concurrency: 2 });
};

/*
 * Get a list of all changes that need to be applied to rules and database scripts.
 */
export const getChanges = (repository, branch, sha) =>
  getTree(repository, branch, sha)
    .then(files => {
      logger.debug(`Files in tree: ${JSON.stringify(files.map(file => ({ path: file.path, sha: file.sha })), null, 2)}`);

      const promises = {
        rules: getRules(repository, branch, files),
        databases: getDatabaseScripts(repository, branch, files)
      };

      return Promise.props(promises)
        .then((result) => ({
          rules: result.rules,
          databases: result.databases
        }));
    });
