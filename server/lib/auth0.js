import _ from 'lodash';
import Promise from 'bluebird';
import * as constants from './constants';

/*
 * Get database connections.
 */
const getDatabaseConnections = (client, databases) => {
  const databaseNames = databases.map(d => d.name);
  return client.connections.getAll({ strategy: 'auth0' })
    .then(connections => connections.filter(c => databaseNames.indexOf(c.name) > -1));
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

  return getDatabaseConnections(client, databases)
    .then(connections =>
      Promise.map(databases,
        (database) => updateDatabase(progress, client, connections, database),
        { concurrency: constants.CONCURRENT_CALLS })
    );
};

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
const deleteRule = (progress, client, rules, existingRule) => {
  const rule = _.find(rules, { name: existingRule.name });
  if (!rule) {
    progress.rulesDeleted++;
    progress.log(`Deleting rule ${existingRule.name} (${existingRule.id})`);
    return client.rules.delete({ id: existingRule.id });
  }

  return null;
};

/*
 * Delete all rules.
 */
export const deleteRules = (progress, client, rules) => {
  if (rules.length === 0) {
    return Promise.resolve(true);
  }

  progress.log('Deleting rules that no longer exist in the repository...');

  return getRules(client)
    .then(existingRules => {
      progress.log(`Existing rules: ${JSON.stringify(existingRules.map(rule => ({ id: rule.id, name: rule.name, stage: rule.stage, order: rule.order })), null, 2)}`);
      return Promise.map(existingRules, (rule) => deleteRule(progress, client, rules, rule), { concurrency: constants.CONCURRENT_CALLS });
    });
};

/*
 * Update a single rule.
 */
const updateRule = (progress, client, existingRules, ruleName, ruleData) => {
  progress.log(`Processing rule '${ruleName}'`);

  const rule = _.find(existingRules, { name: ruleName });
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
    ...ruleData.metadata,
    script: ruleData.script || rule.script
  };

  // Remove properties that are not allowed during update.
  delete payload.stage;

  // Update the rule.
  progress.rulesUpdated++;
  progress.log(`Updating rule ${ruleName} (${rule.id}): ${JSON.stringify(payload, null, 2)}`);
  return client.rules.update({ id: rule.id }, payload);
};

/*
 * Update all rules.
 */
export const updateRules = (progress, client, rules) => {
  if (rules.length === 0) {
    return Promise.resolve(true);
  }

  progress.log('Updating rules...');

  return getRules(client)
    .then(existingRules => {
      progress.log(`Existing rules: ${JSON.stringify(existingRules.map(rule => ({ id: rule.id, name: rule.name, stage: rule.stage, order: rule.order })), null, 2)}`);
      return Promise.map(rules, (rule) => updateRule(progress, client, existingRules, rule.name, rule), { concurrency: constants.CONCURRENT_CALLS });
    });
};
