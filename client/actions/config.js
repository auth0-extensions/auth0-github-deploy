import axios from 'axios';
import * as constants from '../constants';

/*
 * Load the configuration settings.
 */
export function fetchConfiguration() {
  return {
    type: constants.FETCH_CONFIGURATION,
    payload: {
      promise: axios.get('/api/config', {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}
