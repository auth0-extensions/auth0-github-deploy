import logger from './logger';

export default (id, branch, repository) => {
  const logs = [];
  return {
    id,
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
