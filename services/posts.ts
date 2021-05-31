import axios from 'axios';

const apiUrl = 'http://192.168.1.177:3000/api/v1';

axios.defaults.baseURL = apiUrl;

export const fetchAllPosts = () => {
  return axios.get('/posts');
};

export const fetchPostById = (id: string) => {
  return axios.get(`/posts/${id}`);
};
