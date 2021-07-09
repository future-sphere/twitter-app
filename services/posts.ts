import axios from 'axios';

export const fetchAllPosts = () => {
  return axios.get('/posts');
};

export const fetchPostById = (id: string) => {
  return axios.get(`/posts/${id}`);
};
