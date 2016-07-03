import _ from 'lodash';
import Promise from 'bluebird';
import * as constants from '../constants';
import {ValidationError} from '../errors'


/*
 * Get all rules in all stages.
 */
const getRules = (progress, client) => {
  if (progress.rules) return Promise.resolve(progress.rules);

  return Promise.all(constants.RULES_STAGES.map(stage => client.rules.getAll({ stage })))
    .then((...rules) => {
      progress.rules = _.chain(rules)
        .flattenDeep()
        .union()
        .value();
      return progress.rules;
    });
}

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

  return getRules(progress, client)
    .then(existingRules => {
      console.log(arguments);
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

  return getRules(progress, client)
    .then(existingRules => {
      progress.log(`Existing rules: ${JSON.stringify(existingRules.map(rule => ({ id: rule.id, name: rule.name, stage: rule.stage, order: rule.order })), null, 2)}`);
      return Promise.map(rules, (rule) => updateRule(progress, client, existingRules, rule.name, rule), { concurrency: constants.CONCURRENT_CALLS });
    });
};

const validateRulesStages = (progress, client, rules, existingRules) => new Promise((resolve, reject) => {
  // Rules with invalid state
  const invalidStages = _.filter(rules, (rule) => rule.metadata && rule.metadata.stage && constants.RULES_STAGES.indexOf(rule.metadata.stage)<0).map(rule=> rule.name);
  if (invalidStages.length > 0) return reject(new ValidationError(`The following rules have invalid stages set in their metadata files: ${invalidStages}. Go to https://auth0.com/docs/api/management/v2#!/Rules/post_rules to find the valid stage names.`));

  // Rules that changed state
  const changeStages = _.filter(rules, (rule) => rule.metadata && rule.metadata.stage && _.some(existingRules, (existing) => existing.name === rule.name && existing.stage !== rule.metadata.stage)).map(rule => rule.name);
  if (changeStages.length > 0) return reject(new ValidationError(`The following rules changed stage which is not allowed: ${changeStages}. Rename the rules to recreate them and avoid this error.`));
    
  // Rules with the same order number
  const duplicatedStageOrder = _(rules)
    .filter(rule => rule.metadata && rule.metadata.order)
    .countBy(rule => `Stage: '${rule.metadata.stage || constants.DEFAULT_RULE_STAGE}' Order: ${rule.metadata.order}`)
    .omit(count => count < 2)
    .keys()
    .value();
    
  if (duplicatedStageOrder.length > 0) return reject(new ValidationError(`There are multiple rules for the following stage-order combinations [${duplicatedStageOrder}]. Only one rule must be defined for the same order number in a stage.`));

  resolve(true);
})

const validateRulesOrder = (progress, client, rules, existingRules) => {
};

export const validateRules = (progress, client, rules) => {
  if (rules.length === 0) {
    return Promise.resolve(true);
  }

  progress.log('Validating rules...');

  return getRules(progress, client)
    .then(existingRules => validateRulesStages(progress, client, rules, existingRules))
    .then(existingRules => validateRulesOrder(progress, client, rules, existingRules));
}
