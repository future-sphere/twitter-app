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