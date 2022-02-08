import axios, { AxiosError } from 'axios';
import { message } from 'antd';

import { store } from 'core/store';

import dataService from '../data.service';
import { logoutAction, selectToken } from './auth';

const apiClient = axios.create({
  baseURL: dataService.BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = selectToken(store.getState());
  document.cookie = token;

  if (token) {
    config.headers.common = config.headers.common ?? {};
    config.headers.common['Authorization'] = `Bearer ${token}`;
    // config.headers.common['cookie'] = `${token}; SameSite=None; Secure`;
  }
 
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!axios.isCancel(error)) {
      if (error.response?.status === 401) {
        store.dispatch(logoutAction());
      }

      showErrorMessage(error);

      throw error;
    }
  }
);

export default apiClient;

function showErrorMessage(error: AxiosError) {
  const errorMsg = extractErrorMsg(error);

  if (Array.isArray(errorMsg)) {
    errorMsg.forEach((err) => message.error(`${err}`, 5));
  } else {
    message.error(`${errorMsg}`);
  }
}

function extractErrorMsg(error: AxiosError): string | string[] {
  const { response, message } = error;
  const request: XMLHttpRequest | undefined = error.request;
  if (response) {
    if (response.data?.message) {
      return response.data.message;
    } else if (response.data?.error?.message) {
      return response.data.error.message;
    } else if (response.data?.error?.inner) {
      return response.data.error.inner;
    }
    else if (response.data?.errorMessage) {
      return response.data.errorMessage;
    }

    return response.statusText;
  }
  else if (request) {
    return 'Unexpected error occured';
  }
  return message;
}
