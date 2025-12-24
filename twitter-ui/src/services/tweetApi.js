import api from "../api";

export async function likeTweet(tweetId) {
  return api.post("/like", { id: tweetId });
}

export async function dislikeTweet(tweetId) {
  return api.post("/dislike", { id: tweetId });
}

export async function fetchLikes(tweetId) {
  const res = await api.get("/like/byTweetId", { params: { tweetId } });
  return res.data;
}

export async function createRetweet(tweetId) {
  const res = await api.post("/retweet", { id: tweetId });
  return res.data;
}

export async function deleteRetweet(retweetId) {
  return api.delete(`/retweet/${retweetId}`);
}

export async function fetchRetweets(tweetId) {
  const res = await api.get("/retweet/byTweetId", { params: { tweetId } });
  return res.data;
}

export async function createComment(tweetId, content) {
  const res = await api.post("/comment", { id: tweetId, content });
  return res.data;
}

export async function fetchComments(tweetId) {
  const res = await api.get("/comment/byTweetId", { params: { tweetId } });
  return res.data;
}

export async function createTweet(content) {
  const res = await api.post("/tweet", { content });
  return res.data;
}

export async function deleteTweet(tweetId) {
  return api.delete(`/tweet/${tweetId}`);
}

export async function fetchUserByUsername(username) {
  const res = await api.get("/user/byUsername", { params: { username } });
  return res.data;
}

export async function fetchMe() {
  const res = await api.get("/user/me");
  return res.data;
}
