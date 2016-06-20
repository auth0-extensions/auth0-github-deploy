import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { auth } from './auth';
import { deployments } from './deployments';

export default combineReducers({
  routing: routerReducer,
  auth,
  deployments,
  form: formReducer
});
