import axios from 'axios';
import * as constants from '../constants';

/*
 * Load the deployment history.
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
