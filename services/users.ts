import axios, { AxiosResponse } from 'axios';

export const registerUser = ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<AxiosResponse> => {
  return axios.post('/auth/register', { username, password });
};

export const loginUser = ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<AxiosResponse> => {
  return axios.post('/auth/login', { username, password });
};

export const getUserByToken = (token: string): Promise<AxiosResponse> => {
  return axios.post('/user/token', { token });
};

export const getUserByUsername = (username: string): Promise<AxiosResponse> => {
  return axios.get('/user/username', { params: { username } });
};

export const getUsersByIdList = (
  userIdList: string[],
): Promise<AxiosResponse> => {
  return axios.get('/user/list', { params: { userIdList } });
};
