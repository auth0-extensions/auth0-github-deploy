import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { }
};

export const config = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      loading: true,
      record: { }
    }),
  [constants.FETCH_CONFIGURATION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the configuration: ${(action.payload.data && action.payload.data.message) || action.payload.statusText}`
    }),
  [constants.FETCH_CONFIGURATION_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      record: fromJS(data)
    });
  }
});
