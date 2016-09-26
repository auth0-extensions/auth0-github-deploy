import { deploy as sourceDeploy } from 'auth0-source-control-extension-tools';
import config from '../lib/config';
import { getChanges } from './github';


export default (storage, id, branch, repository, sha, user, client) => {
  const context = {
    init: () => getChanges(repository, branch, sha)
      .then(data => {
        context.pages = data.pages;
        context.rules = data.rules;
        context.databases = data.databases;
      })
  };

  const slackTemplate = {
    fallback: 'GitHub to Auth0 Deployment',
    text: `GitHub to Auth0 Deployment`
  };

  return sourceDeploy({ id, branch, repository, sha, user }, context, client, storage, config, slackTemplate);
};
