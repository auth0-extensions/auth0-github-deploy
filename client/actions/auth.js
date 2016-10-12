import axios from 'axios';
import jwtDecode from 'jwt-decode';

import * as constants from '../constants';

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('apiToken');
    sessionStorage.removeItem('apiToken');

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const apiToken = sessionStorage.getItem('token');
    if (apiToken) {
      const decodedToken = jwtDecode(apiToken);
      axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

      dispatch({
        type: constants.LOADED_TOKEN,
        payload: {
          apiToken
        }
      });

      dispatch({
        type: constants.LOGIN_SUCCESS,
        payload: {
          apiToken,
          decodedToken,
          user: decodedToken
        }
      });
      return;
    }
  };
}
