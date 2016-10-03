import {expect} from 'chai';
const nconf = require('nconf');
const path = require('path');
const tools = require('auth0-extension-tools');

import auth0 from '../server/lib/auth0';
import config from '../server/lib/config';
import {getChanges} from '../server/lib/bitbucket';

const progress = {log: () => null};
let client = null;

describe.only('managementApiClient', () => {
  beforeEach(() => {
    nconf
      .argv()
      .env()
      .file(path.join(__dirname, '../server/config.json'))
      .defaults({
        NODE_ENV: 'development',
        HOSTING_ENV: 'default',
        PORT: 3001,
        WT_URL: 'http://localhost:3000'
      });

    config.setProvider((key) => nconf.get(key), null);
  });

  describe('#getSourceData', () => {
    it('should download files from repo', (done) => {
      getChanges(config('BITBUCKET_REPOSITORY'), config('BITBUCKET_BRANCH'), config('BITBUCKET_BRANCH'))
        .then(data => {
          expect(data).not.to.be.null;
          done();
        });
    });
  });

  describe('#getManagementClient', () => {
    it('should get auth0 client', (done) => {
      tools.managementApi.getClient({
        domain: config('AUTH0_DOMAIN'),
        clientId: config('AUTH0_CLIENT_ID'),
        clientSecret: config('AUTH0_CLIENT_SECRET')
      })
        .then(function (managementClient) {
          expect(managementClient).not.to.be.null;
          client = managementClient;
          done();
        });
    });
  });

  describe('#validateEmptyDatabases', () => {
    it('should validate empty databases', (done) => {
      const data = [];

      auth0.validateDatabases(progress, client, data).then(() => {
        done();
      });
    });
  });

  describe('#validateIncorrectDatabases', () => {
    it('should validate incorrect databases', (done) => {
      const data = [{
        name: 'deploy-test-database-' + new Date().getTime(),
        scripts: [{
          stage: "login",
          contents: "function login (email, password, callback) {\nreturn callback(new Error('Not Implemented'));\n}"
        }]
      }];

      auth0.validateDatabases(progress, client, data)
        .catch((err) => {
          expect(err).not.to.be.null;
          done();
        });
    });
  });

  describe('#updateDatabases', () => {
    it('should update databases', (done) => {
      const data = [];

      auth0.updateDatabases(progress, client, data).then(() => {
        done();
      });
    });
  });

  describe('#validateIncorrectRules', () => {
    it('should validate incorrect rules', (done) => {
      const data = [
        {
          metadata: {enabled: false, order: 10},
          name: 'manual-rule-one'
        },
        {
          script: 'function (user, context, callback) {\ncallback(null, user, context);\n}',
          metadata: {order: 15},
          name: 'rule1'
        }];

      auth0.validateRules(progress, client, data, [])
        .catch((err) => {
          expect(err).not.to.be.null;
          done();
        });
    });
  });

  describe('#validateCorrectRules', () => {
    it('should validate correct rules', (done) => {
      const data = [{
        script: 'function (user, context, callback) {\ncallback(null, user, context);\n}',
        metadata: {order: 15},
        name: 'rule1'
      }];

      auth0.validateRules(progress, client, data, []).then(() => {
        done();
      });
    });
  });

  describe('#updateRules', () => {
    it('should update rules', (done) => {
      const data = [{
        script: 'function (user, context, callback) {\ncallback(null, user, context);\n}',
        metadata: {order: 15},
        name: 'rule1'
      }];

      auth0.updateRules(progress, client, data).then(() => {
        done();
      });
    });
  });

  describe('#deleteRules', () => {
    it('should delete all rules', (done) => {
      auth0.deleteRules(progress, client, [], []).then(() => {
        done();
      });
    });
  });

  describe('#updateLoginPage', () => {
    it('should update custom login page', (done) => {
      const data = [
        {
          contents: '<html>\n<head></head>\n\n<body> \n<h1> Login Page </h1>\n</body>\n</html>',
          meta: 'login.json',
          name: 'login.html'
        },
        {
          contents: '{\n\t"enabled": false\n}',
          meta: 'login.json',
          name: 'login.json'
        }];

      auth0.updateLoginPage(progress, client, data).then(() => {
        done();
      });
    });
  });

  describe('#updatePasswordPage', () => {
    it('should update custom password page', (done) => {
      const data = [
        {
          contents: '<html>\n<head></head>\n\n<body> \n<h1> Reset Password Page </h1>\n</body>\n</html>',
          meta: 'password_reset.json',
          name: 'password_reset.html'
        },
        {
          contents: '{\n\t"enabled": false\n}',
          meta: 'password_reset.json',
          name: 'password_reset.json'
        }
      ];

      auth0.updatePasswordResetPage(progress, client, data).then(() => {
        done();
      });
    });
  });
});
