import expect from 'expect';
import githubWebhook from '../../server/lib/middlewares/githubWebhook';

describe('github Webhook', () => {
  it('should return error, if secret is not provided', (done) => {
    const webhook = githubWebhook();
    webhook({}, {}, err => {
      expect(err).toBeA(Error);
      expect(err.message).toEqual('The extension secret is not set, unable to verify webhook signature.');
      done();
    });
  });

  it('should return error, if x-github-delivery header is not provided', (done) => {
    const webhook = githubWebhook('secret');
    webhook({ headers: {} }, {}, err => {
      expect(err).toBeA(Error);
      expect(err.message).toEqual('The GitHub delivery identifier is missing.');
      done();
    });
  });

  it('should return error, if x-github-event header is not provided', (done) => {
    const webhook = githubWebhook('secret');
    webhook({ headers: { 'x-github-delivery': true } }, {}, err => {
      expect(err).toBeA(Error);
      expect(err.message).toEqual('The GitHub event name is missing.');
      done();
    });
  });

  it('should return error, if signature is incorrect', (done) => {
    const webhook = githubWebhook('secret');
    const req = {
      headers: { 'x-github-delivery': true, 'x-github-event': true, 'x-hub-signature': 'signature' },
      rawBody: 'someRawBody'
    };

    webhook(req, {}, err => {
      expect(err).toBeA(Error);
      expect(err.message).toEqual('The GitHub webhook signature is incorrect.');
      done();
    });
  });

  it('should update req.webhook', (done) => {
    const webhook = githubWebhook('secret');
    const req = {
      headers: { 'x-github-delivery': 'id', 'x-github-event': 'event', 'x-hub-signature': 'sha1=091486123ad57d92919ee0d9d68444504eb7e2cd' },
      body: {},
      rawBody: 'someRawBody'
    };

    webhook(req, {}, () => {
      expect(req.webhook).toBeA(Object);
      expect(req.webhook.id).toEqual('id');
      expect(req.webhook.event).toEqual('event');
      done();
    });
  });


  it('should work correctly with utf-8 characters in rawBody', (done) => {
    const webhook = githubWebhook('secret');
    const req = {
      headers: { 'x-github-delivery': 'id', 'x-github-event': 'event', 'x-hub-signature': 'sha1=b9df8268adc51476901ddc0b8d4ff24c90b4bcc1' },
      body: {},
      rawBody: 'someRawЇжак'
    };

    webhook(req, {}, () => {
      expect(req.webhook).toBeA(Object);
      expect(req.webhook.id).toEqual('id');
      expect(req.webhook.event).toEqual('event');
      done();
    });
  });
});
