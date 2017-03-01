import axios from 'axios';
import * as constants from '../constants';
import { isTokenExpired, decodeToken } from '../utils/auth';

export function logout() {
  return (dispatch) => {
    sessionStorage.removeItem('github-deploy:apiToken');
    window.location.href = `${window.config.BASE_URL}/logout`;

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const apiToken = sessionStorage.getItem('github-deploy:apiToken');
    if (apiToken) {
      const decodedToken = decodeToken(apiToken);
      if (isTokenExpired(decodedToken)) {
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

      sessionStorage.setItem('github-deploy:apiToken', apiToken);

      dispatch({
        type: constants.RECIEVED_TOKEN,
        payload: {
          token: apiToken
        }
      });

      dispatch({
        type: constants.LOGIN_SUCCESS,
        payload: {
          token: apiToken,
          decodedToken,
          user: decodedToken
        }
      });
      return;
    }
  };
}
