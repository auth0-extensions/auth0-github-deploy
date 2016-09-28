import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: []
};

export const rules = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_RULES_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_RULES_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the applications: ${action.errorMessage}`
    }),
  [constants.FETCH_RULES_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      records: fromJS(action.payload.data)
    })
});
