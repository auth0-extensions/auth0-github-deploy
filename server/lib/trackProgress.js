import logger from './logger';

export default (id, branch, repository, user) => {
  const logs = [];
  const log = (message) => {
    logs.push({ date: new Date(), message });
    logger.debug(message);
  };

  log(`Deploying '${id}' triggered by ${user}`);

  return {
    id,
    user,
    branch,
    repository,
    date: new Date(),
    connectionsUpdated: 0,
    rulesCreated: 0,
    rulesUpdated: 0,
    rulesDeleted: 0,
    error: null,
    logs,
    log: (message) => {
      logs.push({ date: new Date(), message });
      logger.debug(message);
    }
  };
};
