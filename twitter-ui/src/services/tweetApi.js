import api from "../api";

export const register = async (payload) => {
  const res = await api.post("/register", payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await api.post("/login", payload);
  return res.data;
};

export const fetchMe = async () => {
  const res = await api.get("/user/me");
  return res.data;
};

export const fetchUserByUsername = async (username) => {
  const res = await api.get("/user/byUsername", { params: { username } });
  return res.data;
};

export const fetchAllTweets = async () => {
  const res = await api.get("/tweet/all");
  return res.data;
};

export const fetchTweetById = async (id) => {
  const res = await api.get("/tweet/findById", { params: { id } });
  return res.data;
};

export const fetchTweetsByUserId = async (userId) => {
  const res = await api.get("/tweet/findByUserId", { params: { userId } });
  return res.data;
};

export const createTweet = async (content) => {
  const res = await api.post("/tweet", { content });
  return res.data;
};

export const deleteTweet = async (id) => {
  const res = await api.delete(`/tweet/${id}`);
  return res.data;
};

export const createComment = async (tweetId, content) => {
  const res = await api.post("/comment", { tweetId, content });
  return res.data;
};

export const deleteComment = async (id) => {
  const res = await api.delete(`/comment/${id}`);
  return res.data;
};

export const fetchComments = async (tweetId) => {
  const res = await api.get("/comment/byTweetId", { params: { id: tweetId } });
  return res.data;
};

export const likeTweet = async (tweetId) => {
  const res = await api.post("/like", { id: tweetId });
  return res.data;
};

export const dislikeTweet = async (tweetId) => {
  const res = await api.post("/dislike", { id: tweetId });
  return res.data;
};

export const fetchLikes = async (tweetId) => {
  const res = await api.get("/like/byTweetId", { params: { id: tweetId } });
  return res.data;
};

export const createRetweet = async (tweetId) => {
  const res = await api.post("/retweet", { id: tweetId });
  return res.data;
};

export const deleteRetweet = async (id) => {
  const res = await api.delete(`/retweet/${id}`);
  return res.data;
};

export const fetchRetweets = async (tweetId) => {
  const res = await api.get("/retweet/byTweetId", { params: { id: tweetId } });
  return res.data;
};
