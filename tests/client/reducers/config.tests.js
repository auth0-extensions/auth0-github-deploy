import expect from 'expect';
import { config } from '../../../client/reducers/config';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: {}
};

describe('config reducer', () => {
  it('should return the initial state', () => {
    expect(
      config(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_CONFIGURATION_PENDING', () => {
    expect(
      config(initialState, {
        type: constants.FETCH_CONFIGURATION_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {}
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_REJECTED with data', () => {
    expect(
      config(initialState, {
        type: constants.FETCH_CONFIGURATION_REJECTED,
        payload: {
          data: {
            message: 'ERROR'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the configuration: ERROR',
        record: {}
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_REJECTED without data', () => {
    expect(
      config(initialState, {
        type: constants.FETCH_CONFIGURATION_REJECTED,
        payload: {
          statusText: 'ERROR'
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the configuration: ERROR',
        record: {}
      }
    );
  });

  it('should handle FETCH_CONFIGURATION_FULFILLED', () => {
    expect(
      config(initialState, {
        type: constants.FETCH_CONFIGURATION_FULFILLED,
        payload: {
          data: {
            attribute: 'test'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {
          attribute: 'test'
        }
      }
    );
  });
});
