import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';
import request from 'request-promise';

import config from './config';
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
 * Append file to the assets to process.
 */
const appendFile = (file, appendTo = [], removeFrom = []) => {
  if (appendTo.indexOf(file) === -1) {
    appendTo.push(file);
  }

  const removedIndex = removeFrom.indexOf(file);
  if (removedIndex > -1) {
    removeFrom.splice(removedIndex, 1);
  }
};

/*
 * Get a flat list of changes and files that need to be added/updated/removed.
 */
const getFiles = (commits) => {
  const modified = [];
  const removed = [];

  commits.forEach(commit => {
    const changedFiles = _.chain()
      .union([ commit.added, commit.modified ])
      .flattenDeep()
      .uniq()
      .filter(validFilesOnly)
      .value();
    const removedFiles = _.chain(commit.removed)
      .flattenDeep()
      .uniq()
      .filter(validFilesOnly)
      .without(...changedFiles)
      .value();

    changedFiles.forEach(file => appendFile(file, modified, removed));
    removedFiles.forEach(file => appendFile(file, removed, modified));
  });

  return {
    modified,
    removed
  };
};

/*
 * Download a single file.
 */
const downloadFile = (repository, branch, fileName) => {
  const token = config('GITHUB_TOKEN');
  const url = `https://${token}:x-oauth-basic@raw.githubusercontent.com/${repository}/${branch}/${fileName}`;

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
 * Get the list of rules that should be removed.
 */
const getRemovedRules = (files) => {
  // Rules object.
  const rules = [ ];

  // Determine if we have the script, the metadata or both.
  _.filter(files, isRule).forEach(fileName => {
    const ruleName = path.parse(fileName).name;
    rules[ruleName] = rules[ruleName] || { };

    if (/\.js$/i.test(fileName)) {
      rules.push(ruleName);
    }
  });

  // Return all rules to be deleted.
  return rules;
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
 * Get the list of database scripts that should be removed.
 */
const getRemovedDatabaseScripts = (files) => {
  const databases = [ ];

  // Determine if we have the script, the metadata or both.
  _.filter(files, isDatabaseConnection).forEach(fileName => {
    const script = getDatabaseScriptDetails(fileName);
    if (script) {
      databases.push({
        name: script.database,
        scripts: [
          { stage: script.name }
        ]
      });
    }
  });

  // Return all rules to be deleted.
  return databases;
};

/*
 * Generate a custom scripts object compatible with the management API.
 */
const getCustomScripts = (modified, removed) => {
  const databases = { };

  // Add each modified script.
  modified.forEach(database => {
    databases[database.name] = databases[database.name] || { };
    databases[database.name].customScripts = databases[database.name].customScripts || { };

    database.scripts.forEach(script => {
      databases[database.name].customScripts[script.stage] = script.contents;
    });
  });

  // Add each removed script.
  removed.forEach(database => {
    databases[database.name] = databases[database.name] || { };
    databases[database.name].customScripts = databases[database.name].customScripts || { };

    database.scripts.forEach(script => {
      databases[database.name].customScripts[script.stage] = null;
    });
  });

  return databases;
};

/*
 * Get a list of all changes that need to be applied to rules and database scripts.
 */
export const getChanges = (repository, branch, commits) => {
  const { modified, removed } = getFiles(commits);
  const promises = {
    rulesModified: getRules(repository, branch, modified),
    rulesRemoved: getRemovedRules(removed),
    databasesModified: getDatabaseScripts(repository, branch, modified),
    databasesRemoved: getRemovedDatabaseScripts(removed)
  };

  return Promise.props(promises)
    .then((result) => ({
      rules: {
        modified: result.rulesModified,
        removed: result.rulesRemoved
      },
      databases: getCustomScripts(result.databasesModified, result.databasesRemoved)
    }));
};
