import axios from 'axios';

import * as constants from '../constants';

/*
 * Load all available deployments.
 */
export function fetchDeployments() {
  return {
    type: constants.FETCH_DEPLOYMENTS,
    payload: {
      promise: axios.get('/api/deployments', {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}
