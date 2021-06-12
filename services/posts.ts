import axios from 'axios';

const apiUrl = 'http://192.168.1.191:3000/api/v1';

axios.defaults.baseURL = apiUrl;

export const fetchAllPosts = () => {
  console.log(apiUrl);
  return axios.get('/posts');
};

export const fetchPostById = (id: string) => {
  return axios.get(`/posts/${id}`);
};
