import axios from 'axios';

import {
  BAD_REQUEST,
  OK,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} from '../constants/statusCode';
import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_SIGNATURE_EXCEPTION,
  ACCESS_TOKEN_MALFORMED,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_SIGNATURE_EXCEPTION,
  REFRESH_TOKEN_MALFORMED,
} from '../constants/statusMessage';
import { setMoveToLoginPage } from '../utils/setMoveToLoginPage';

const baseURL = process.env.REACT_APP_BASE_URL;
const instance = axios.create({ baseURL });

const setToken = (config) => {
  config.headers['Content-Type'] = 'application/json; charset=utf-8';
  config.headers['Access-Control-Allow-Origin'] = '*';
  config.headers['Access-Control-Allow-Credentials'] = true;
  config.headers['A-AUTH-TOKEN'] =
    window.localStorage.getItem('habitAccessToken');
  config.headers.withCredentials = true;
  return config;
};

instance.interceptors.request.use(setToken);

instance.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const { data: responseData, config: originalRequest } = error.response;

    if (responseData.statusCode === INTERNAL_SERVER_ERROR) {
      window.alert(INTERNAL_SERVER_ERROR);
      setMoveToLoginPage();
      return Promise.reject(error);
    }

    if (responseData.statusCode === UNAUTHORIZED) {
      if (responseData.responseMessage === ACCESS_TOKEN_SIGNATURE_EXCEPTION) {
        window.alert(ACCESS_TOKEN_SIGNATURE_EXCEPTION);
        setMoveToLoginPage();
        return Promise.reject(error);
      }

      if (responseData.responseMessage === ACCESS_TOKEN_MALFORMED) {
        window.alert(ACCESS_TOKEN_MALFORMED);
        setMoveToLoginPage();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    if (
      responseData.statusCode === BAD_REQUEST &&
      responseData.responseMessage === ACCESS_TOKEN_EXPIRED
    ) {
      window.alert(ACCESS_TOKEN_EXPIRED);

      try {
        const { data } = await axios({
          method: 'GET',
          url: `${process.env.REACT_APP_BASE_URL}user/loginCheck`,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'R-AUTH-TOKEN': `${window.localStorage.getItem(
              'habitRefreshToken',
            )}`,
          },
        });

        if (data.statusCode === OK) {
          window.alert('AccessToken Reissued Successfully');
          window.localStorage.setItem('habitAccessToken', data.accessToken);
          originalRequest.headers['A-AUTH-TOKEN'] = `${data.accessToken}`;
          window.alert('Resend Original Request');
          return axios(originalRequest);
        }
      } catch (error) {
        if (
          error.response.data.statusCode === BAD_REQUEST &&
          error.response.data.responseMessage === REFRESH_TOKEN_EXPIRED
        ) {
          window.alert(REFRESH_TOKEN_EXPIRED);
          setMoveToLoginPage();
          return Promise.reject(error);
        }

        if (error.response.data.statusCode === UNAUTHORIZED) {
          if (
            error.response.data.responseMessage ===
            REFRESH_TOKEN_SIGNATURE_EXCEPTION
          ) {
            window.alert(REFRESH_TOKEN_SIGNATURE_EXCEPTION);
            setMoveToLoginPage();
            return Promise.reject(error);
          }

          if (error.response.data.responseMessage === REFRESH_TOKEN_MALFORMED) {
            window.alert(REFRESH_TOKEN_MALFORMED);
            setMoveToLoginPage();
            return Promise.reject(error);
          }
        }

        window.alert('Unexpected Error Occured1');
        // setMoveToLoginPage();
        return Promise.reject(error);
      }
    }

    window.alert('Unexpected Error Occured2');
    // setMoveToLoginPage();
    return Promise.reject(error);
  },
);

export default instance;
