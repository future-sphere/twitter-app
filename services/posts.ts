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

export const handleDeletePost = (postId: string) => {
  return axios.delete(`/posts/${postId}`);
};

export const handleUnLikePost = (userId: string, postId: string) => {
  return axios.put(`/posts/${postId}/unlike`, {
    userId,
  });
};

export const handleLikeComment = (
  userId: string,
  postId: string,
  commentId: string,
) => {
  return axios.put(`/posts/${postId}/comment/like`, {
    commentId,
    userId,
  });
};

export const handleDeleteComment = (commentId: string, postId: string) => {
  return axios.delete(`/posts/${postId}/comment`, { data: { commentId } });
};

export const postComment = (userId: string, text: string, postId: string) => {
  return axios.post('/posts/comment', {
    userId,
    text,
    postId,
  });
};

export const createPost = (author: string, title: string) => {
  return axios.post('/posts', {
    author,
    title,
  });
};

const PostService = {
  handleLikeComment,
  postComment,
  createPost,
  handleDeletePost,
  handleDeleteComment,
};

export default PostService;
