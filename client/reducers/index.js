import { combineReducers } from 'redux';

import { auth } from './auth';
import { config } from './config';
import { deployments } from './deployments';
import { rules } from './rules';

export default combineReducers({
  auth,
  config,
  deployments,
  rules
});
