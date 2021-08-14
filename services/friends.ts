import axios, { AxiosResponse } from 'axios';

export const addFriend = (
  userId: string,
  friendId: string,
): Promise<AxiosResponse> => {
  return axios.post('/friends', { userId, friendId });
};
