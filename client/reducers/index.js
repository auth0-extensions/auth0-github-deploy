import { combineReducers } from 'redux';

import { auth } from './auth';
import { config } from './config';
import { deployments } from './deployments';

export default combineReducers({
  auth,
  config,
  deployments
});
