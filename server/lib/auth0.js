import _ from 'lodash';
import Promise from 'bluebird';
import * as constants from './constants';

/*
 * Load the connections from Auth0 and merge any changes that have been made to custom scripts.
 */
export const mergeDatabaseConnectionScripts = (client, databases) =>
  client.connections.getAll({ strategy: 'auth0' })
    .then(connections => Object.keys(databases).map(databaseName => {
      const connection = _.find(connections, { name: databaseName });
      if (!connection) {
        throw new Error(`Unable to find connection named: '${databaseName}'`);
      }

      connection.options = connection.options || { };
      connection.options.customScripts = {
        ...connection.options.customScripts,
        ...databases[databaseName].customScripts
      };

      return connection;
    }));

/*
 * Update all databases.
 */
export const updateDatabases = (progress, client, databases) =>
  Promise.map(databases,
    (database) => {
      progress.connectionsUpdated++;
      progress.log(`Updating database ${database.id}: ${JSON.stringify(database.options, null, 2)}`);
      return client.connections.update({ id: database.id }, { options: database.options });
    },
    { concurrency: 2 });

/*
 * Get all rules in all stages.
 */
const getRules = (client) =>
  Promise.all(constants.RULES_STAGES.map(stage => client.rules.getAll({ stage })))
    .then((...rules) => _.chain(rules)
      .flattenDeep()
      .union()
      .value());

/*
 * Delete a rule.
 */
const deleteRule = (progress, client, rules, ruleName) => {
  const rule = _.find(rules, { name: ruleName });
  if (rule) {
    progress.rulesDeleted++;
    progress.log(`Deleting rule ${ruleName} (${rule.id})`);
    return client.rules.delete({ id: rule.id });
  }

  progress.log(`Couldn't delete '${ruleName}' - Rule does not exist.`);

  return null;
};

/*
 * Delete all rules.
 */
export const deleteRules = (progress, client, deletedRules) =>
  getRules(client)
    .then(rules => Promise.map(deletedRules, (ruleName) => deleteRule(progress, client, rules, ruleName), { concurrency: 2 }));

/*
 * Update a single rule.
 */
const updateRule = (progress, client, rules, ruleName, ruleData) => {
  progress.log(`Processing rule '${ruleName}'`);

  const rule = _.find(rules, { name: ruleName });
  if (!rule) {
    const payload = {
      enabled: true,
      stage: 'login_success',
      ...ruleData.metadata,
      name: ruleName,
      script: ruleData.script
    };

    progress.rulesCreated++;
    progress.log(`Creating rule ${ruleName}: ${JSON.stringify(payload, null, 2)}`);

    return client.rules.create(payload);
  }

  const payload = {
    ...rule,
    ...ruleData.metadata,
    script: ruleData.script || rule.script
  };

  // Remove properties that are not allowed during update.
  delete payload.id;
  delete payload.stage;

  progress.rulesUpdated++;
  progress.log(`Updating rule ${ruleName} (${rule.id}): ${JSON.stringify(payload, null, 2)}`);
  return client.rules.update({ id: rule.id }, payload);
};

/*
 * Update all rules.
 */
export const updateRules = (progress, client, updatedRules) =>
  getRules(client)
    .then(rules => Promise.map(updatedRules, (rule) => updateRule(progress, client, rules, rule.name, rule), { concurrency: 2 }));
