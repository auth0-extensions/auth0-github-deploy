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

      const [ user, repo ] = repository.split('/');
      github.gitdata.getTree({ user, repo, sha: sha || branch, recursive: true },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          try {
            const files = res.tree
              .filter(f => f.type === 'blob')
              .map(f => f.path)
              .filter(validFilesOnly);
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
const downloadFile = (repository, branch, fileName) => {
  const token = config('GITHUB_TOKEN');
  const url = `https://${token}:x-oauth-basic@raw.githubusercontent.com/${repository}/${branch}/${fileName}`;

  logger.debug(`Downloading file: 'https://YOUR-TOKEN:x-oauth-basic@raw.githubusercontent.com/${repository}/${branch}/${fileName}''`);

  return request({ uri: url, json: false })
    .then(body => ({
      fileName,
      contents: body
    }));
};

/*
 * Download a single rule with its metadata.
 */
const downloadRule = (repository, branch, ruleName, rule) => {
  let req = Promise.resolve();
  const currentRule = {
    ...rule,
    name: ruleName
  };

  if (rule.script) {
    req = req.then(() => downloadFile(repository, branch, `${constants.RULES_DIRECTORY}/${encodeURIComponent(ruleName)}.js`)
      .then(file => {
        currentRule.script = file.contents;
        return currentRule;
      })
    );
  }

  if (rule.metadata) {
    req = req.then(() => downloadFile(repository, branch, `${constants.RULES_DIRECTORY}/${encodeURIComponent(ruleName)}.json`)
      .then(file => {
        currentRule.metadata = JSON.parse(file.contents);
        return currentRule;
      })
    );
  }

  return req.then(() => currentRule);
};

/*
 * Determine if we have the script, the metadata or both.
 */
const getRules = (repository, branch, files) => {
  // Rules object.
  const rules = { };

  // Determine if we have the script, the metadata or both.
  _.filter(files, isRule).forEach(fileName => {
    const ruleName = path.parse(fileName).name;
    rules[ruleName] = rules[ruleName] || { };

    if (/\.js$/i.test(fileName)) {
      rules[ruleName].script = true;
    } else if (/\.json$/i.test(fileName)) {
      rules[ruleName].metadata = true;
    }
  });

  // Download all rules.
  return Promise.map(Object.keys(rules), (ruleName) => downloadRule(repository, branch, ruleName, rules[ruleName]), { concurrency: 2 });
};

/*
 * Download a single database script.
 */
const downloadDatabaseScript = (repository, branch, databaseName, scripts) => {
  let req = Promise.resolve();
  const database = {
    name: databaseName,
    scripts: []
  };

  scripts.forEach(script => {
    req = req.then(() => downloadFile(repository, branch, `${constants.DATABASE_CONNECTIONS_DIRECTORY}/${databaseName}/${script}.js`))
      .then(file => {
        database.scripts.push({
          stage: script,
          contents: file.contents
        });
        return database;
      });
  });

  return req;
};

/*
 * Get all database scripts.
 */
const getDatabaseScripts = (repository, branch, files) => {
  const databases = { };

  // Determine if we have the script, the metadata or both.
  _.filter(files, isDatabaseConnection).forEach(fileName => {
    const script = getDatabaseScriptDetails(fileName);
    if (script) {
      databases[script.database] = databases[script.database] || [ ];
      databases[script.database].push(script.name);
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
      logger.debug(`Files in tree: ${JSON.stringify(files, null, 2)}`);

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
