import _ from 'lodash';
import Promise from 'bluebird';
import * as constants from '../constants';
import {ValidationError} from '../errors'


/*
 * Get database connections.
 */
const getDatabaseConnections = (progress, client, databases) => {
  if (progress.connections) return Promise.resolve(progress.connections);

  const databaseNames = databases.map(d => d.name);
  return client.connections.getAll({ strategy: 'auth0' })
    .then(connections => {
      progress.connections = connections.filter(c => databaseNames.indexOf(c.name) > -1);
      return progress.connections;
  });
};

/*
 * Update a database.
 */
const updateDatabase = (progress, client, connections, database) => {
  progress.log(`Processing connection '${database.name}'`);

  const connection = _.find(connections, { name: database.name });
  if (!connection) {
    throw new Error(`Unable to find connection named: '${database.name}'`);
  }

  const options = connection.options || { };
  options.customScripts = { };

  // Reset all scripts.
  constants.DATABASE_SCRIPTS.forEach(script => {
    options.customScripts[script] = null;
  });

  // Set all custom scripts from GitHub.
  database.scripts.forEach((script) => {
    options.customScripts[script.stage] = script.contents;
  });

  progress.connectionsUpdated++;
  progress.log(`Updating database ${connection.id}: ${JSON.stringify(options, null, 2)}`);
  return client.connections.update({ id: connection.id }, { options });
};

/*
 * Update all databases.
 */
export const updateDatabases = (progress, client, databases) => {
  if (databases.length === 0) {
    return Promise.resolve(true);
  }

  return getDatabaseConnections(progress, client, databases)
    .then(connections =>
      Promise.map(databases,
        (database) => updateDatabase(progress, client, connections, database),
        { concurrency: constants.CONCURRENT_CALLS })
    );
};


/* 
 * Validates that all databases included in the repo exist in the tenant
 */
export const validateDatabases = (progress, client, databases) => {
 if (databases.length === 0) {
    return Promise.resolve(true);
  }

  progress.log('Validating that databases exist in Auth0...');

  return getDatabaseConnections(progress, client, databases)
    .then(connections => {
      const missingDatabases = _.difference(
        _.map(databases, db => db.name),
        _.map(connections, conn => conn.name));

      if (missingDatabases.length > 0) throw new ValidationError(`The following databases do not exist in the Auth0 tenant: ${missingDatabases}`);

      return true;
    });
};
