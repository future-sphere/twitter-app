import axios from 'axios';

export const fetchAllPosts = () => {
  return axios.get('/posts');
};

export const fetchPostById = (id: string) => {
  return axios.get(`/posts/${id}`);
};

export const handleLikePost = (userId: string, postId: string) => {
  return axios.put(`/posts/${postId}/like`, {
    userId,
  });
};

export const handleUnLikePost = (userId: string, postId: string) => {
  return axios.put(`/posts/${postId}/unlike`, {
    userId,
  });
};

export const handleLikeComment = (
  userId: string,
  postId: string,
  commentId: string
) => {
  return axios.put(`/posts/${postId}/comment/like`, {
    commentId,
    userId,
  });
};

const PostService = {
  handleLikeComment,
};

export default PostService;
