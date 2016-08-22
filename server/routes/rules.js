import _ from 'lodash';
import express from 'express';

export default () => {
  const api = express.Router();

  api.get('/', (req, res, next) => {
    req.auth0.rules.get()
      .then(rules => {
        req.storage.read()
          .then(data => {
            const result = {};

            if (data && data.excluded_rules) {
              _.forEach(rules, (rule) => {
                result[rule.name] = (data.excluded_rules.indexOf(rule.name) >= 0);
              });
            }
            else {
              _.forEach(rules, (rule) => {
                result[rule.name] = false;
              });
            }

            res.json(result);
          })
          .catch(next);
      })
      .catch(next);
  });

  api.post('/', (req, res, next) => {
    const excluded_rules = req.body.names || [];

    req.storage.read()
      .then(data => {
        data.excluded_rules = excluded_rules;
        return data;
      })
      .then(data => req.storage.write(data))
      .then(() => req.status(200).send())
      .catch(next)
  });

  return api;
};
