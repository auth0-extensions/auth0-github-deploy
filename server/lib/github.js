import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';
import GitHubApi from 'github';
import request from 'request-promise';
import { constants, unifyDatabases, unifyScripts } from 'auth0-source-control-extension-tools';

import config from './config';
import logger from '../lib/logger';

/*
 * Check if a file is part of the rules folder.
 */
const isRule = (file) =>
file.indexOf(`${constants.RULES_DIRECTORY}/`) === 0;

/*
 * Check if a file is part of the database folder.
 */
const isDatabaseConnection = (file) =>
  file.indexOf(`${constants.DATABASE_CONNECTIONS_DIRECTORY}/`) === 0;

/*
 * Check if a file is part of the pages folder.
 */
const isPage = (file) =>
  file.indexOf(`${constants.PAGES_DIRECTORY}/`) === 0 && constants.PAGE_NAMES.indexOf(file.split('/').pop()) >= 0;

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
  if (isPage(fileName)) {
    return true;
  } else if (isRule(fileName)) {
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
      console.log('Repository: ', repository);
      console.log('Branch: ', branch);
      console.log('Sha: ', sha);

      const host = config('GITHUB_HOST') || 'api.github.com';
      const pathPrefix = host !== 'api.github.com' ? config('GITHUB_API_PATH') || '/api/v3' : '';
      const github = new GitHubApi({
        version: '3.0.0',
        host,
        pathPrefix
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
      console.log(e);
      reject(e);
    }
  });

/*
 * Download a single file.
 */
const downloadFile = (repository, branch, file) => {
  const token = config('GITHUB_TOKEN');
  const host = config('GITHUB_HOST') || 'api.github.com';
  const pathPrefix = host !== 'api.github.com' ? config('GITHUB_API_PATH') || '/api/v3' : '';
  const url = `https://${token}:x-oauth-basic@${host}${pathPrefix}/repos/${repository}/git/blobs/${file.sha}`;

  return request({ uri: url, json: true, headers: { 'user-agent': 'auth0-github-deploy' } })
    .then(blob => {
      logger.debug(`Downloaded ${file.path} (${file.sha})`);

      return {
        fileName: file.path,
        contents: (new Buffer(blob.content, 'base64')).toString()
      };
    })
    .catch(err => {
      logger.error(`Error downloading '${host}${pathPrefix}/repos/${repository}/git/blobs/${file.sha}'`);
      logger.error(err);

      throw err;
    });
};

/*
 * Download a single rule with its metadata.
 */
const downloadRule = (repository, branch, ruleName, rule) => {
  const currentRule = {
    script: false,
    metadata: false,
    name: ruleName
  };

  const downloads = [];

  if (rule.script) {
    downloads.push(downloadFile(repository, branch, rule.scriptFile)
      .then(file => {
        currentRule.script = true;
        currentRule.scriptFile = file.contents;
      }));
  }

  if (rule.metadata) {
    downloads.push(downloadFile(repository, branch, rule.metadataFile)
      .then(file => {
        currentRule.metadata = true;
        currentRule.metadataFile = file.contents;
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
  const rules = {};

  // Determine if we have the script, the metadata or both.
  _.filter(files, f => isRule(f.path)).forEach(file => {
    const ruleName = path.parse(file.path).name;
    rules[ruleName] = rules[ruleName] || {};

    if (/\.js$/i.test(file.path)) {
      rules[ruleName].script = true;
      rules[ruleName].scriptFile = file;
    } else if (/\.json$/i.test(file.path)) {
      rules[ruleName].metadata = true;
      rules[ruleName].metadataFile = file;
    }
  });

  // Download all rules.
  return Promise.map(Object.keys(rules), (ruleName) =>
    downloadRule(repository, branch, ruleName, rules[ruleName]), { concurrency: 2 });
};

/*
 * Download a single database script.
 */
const downloadDatabaseScript = (repository, branch, databaseName, scripts) => {
  const database = {
    name: databaseName,
    scripts: []
  };

  const downloads = [];
  scripts.forEach(script => {
    downloads.push(downloadFile(repository, branch, script)
      .then(file => {
        database.scripts.push({
          name: script.name,
          scriptFile: file.contents
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
  const databases = {};

  // Determine if we have the script, the metadata or both.
  _.filter(files, f => isDatabaseConnection(f.path)).forEach(file => {
    const script = getDatabaseScriptDetails(file.path);
    if (script) {
      databases[script.database] = databases[script.database] || [];
      databases[script.database].push({
        ...script,
        sha: file.sha,
        path: file.path
      });
    }
  });

  return Promise.map(Object.keys(databases), (databaseName) =>
      downloadDatabaseScript(repository, branch, databaseName, databases[databaseName]),
    { concurrency: 2 });
};

/*
 * Download a single page script.
 */
const downloadPage = (repository, branch, pageName, page, shaToken) => {
  const downloads = [];
  const currentPage = {
    metadata: false,
    name: pageName
  };

  if (page.file) {
    downloads.push(downloadFile(repository, branch, page.file, shaToken)
      .then(file => {
        currentPage.htmlFile = file.contents;
      }));
  }

  if (page.meta_file) {
    downloads.push(downloadFile(repository, branch, page.meta_file, shaToken)
      .then(file => {
        currentPage.metadata = true;
        currentPage.metadataFile = file.contents;
      }));
  }

  return Promise.all(downloads).then(() => currentPage);
};

/*
 * Get all pages.
 */
const getPages = (repository, branch, files, shaToken) => {
  const pages = {};

  // Determine if we have the script, the metadata or both.
  _.filter(files, f => isPage(f.path)).forEach(file => {
    const pageName = path.parse(file.path).name;
    const ext = path.parse(file.path).ext;
    pages[pageName] = pages[pageName] || {};

    if (ext !== '.json') {
      pages[pageName].file = file;
      pages[pageName].sha = file.sha;
      pages[pageName].path = file.path;
    } else {
      pages[pageName].meta_file = file;
      pages[pageName].meta_sha = file.sha;
      pages[pageName].meta_path = file.path;
    }
  });

  return Promise.map(Object.keys(pages), (pageName) =>
    downloadPage(repository, branch, pageName, pages[pageName], shaToken), { concurrency: 2 });
};

/*
 * Get a list of all changes that need to be applied to rules and database scripts.
 */
export const getChanges = (repository, branch, sha) =>
  getTree(repository, branch, sha)
    .then(files => {
      logger.debug(`Files in tree: ${JSON.stringify(files.map(file => ({
        path: file.path,
        sha: file.sha
      })), null, 2)}`);

      const promises = {
        rules: getRules(repository, branch, files),
        databases: getDatabaseScripts(repository, branch, files),
        pages: getPages(repository, branch, files)
      };

      return Promise.props(promises)
        .then((result) => ({
          rules: unifyScripts(result.rules),
          databases: unifyDatabases(result.databases),
          pages: unifyScripts(result.pages)
        }));
    });
