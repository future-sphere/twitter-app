import axios, { AxiosResponse } from 'axios';

export const addFriend = (
  userId: string,
  friendId: string,
): Promise<AxiosResponse> => {
  return axios.post('/friends', { userId, friendId });
};

export const removeFriend = (
  userId: string,
  friendId: string,
): Promise<AxiosResponse> => {
  return axios.delete('/friends', { data: { userId, friendId } });
};
