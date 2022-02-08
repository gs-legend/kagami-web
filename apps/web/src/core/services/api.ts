import { SHA256 } from 'crypto-js';
import apiClient from 'core/services/apiClient';
import {
  LoginPayload,
  AuthResponse,
  ForgottenPasswordPayload,
} from 'core/services/ApiTypes';

import dataService from 'core/data.service';
import { store } from 'core/store';
import { trackProgress } from './trackProgress';
import { selectDomain } from './auth';


export const apiCallIds = {
  LOGIN: 'LOGIN',
  FORGOTTEN_PASSWORD: 'FORGOTTEN_PASSWORD',
  GET_DOMAIN: 'GET_DOMAIN',
  GET_LOGO: 'GET_LOGO'
};


const Api = {
  login: (data: LoginPayload) => {
    const hash = "" + SHA256(data.password);
    const userDomain = selectDomain(store.getState());

    const newData: LoginPayload = {
      username: data.username,
      password: hash,
      authServerHost: window.location.host,
      userDomain: userDomain
    };
    return trackProgress(apiClient.post<AuthResponse>(dataService.BASE_URL + 'api/auth/login', newData));
  },

  logout: () =>
    trackProgress(apiClient.get(dataService.BASE_URL + 'api/auth/logout')),

  forgottenPassword: (data: ForgottenPasswordPayload) =>
    trackProgress(apiClient.post(dataService.BASE_URL + 'api/auth/forgotten-password', data)),

  getDomain: () =>
    trackProgress(apiClient.get(dataService.BASE_URL + 'api/auth/getDomain')),

  getLogo: () =>
    trackProgress(apiClient.post(dataService.BASE_URL + 'api/auth/getLogo', {})),

  getUser: () =>
    trackProgress(apiClient.get(dataService.BASE_URL + 'role/role/getUser', { withCredentials: true })),

  getDashboard: () =>
    trackProgress(apiClient.post(dataService.BASE_URL + 'api/presentation/getDashboard', {}, { withCredentials: true })),

  getAppAndUserContext: () =>
    trackProgress(apiClient.get(dataService.BASE_URL + 'bpm/cache/getAppAndUserContext', { withCredentials: true })),

  process: (data: any) =>
    trackProgress(apiClient.post(dataService.BASE_URL + 'bpm/bpm/process', data, { withCredentials: true })),

};

export default Api;