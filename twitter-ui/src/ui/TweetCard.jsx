import { useEffect, useMemo, useRef, useState } from "react";
import { FiHeart, FiMessageCircle, FiMoreHorizontal, FiRepeat, FiShare } from "react-icons/fi";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import {
  createComment,
  deleteComment,
  createRetweet,
  deleteRetweet,
  fetchComments,
  fetchLikes,
  fetchRetweets,
  likeTweet,
  dislikeTweet,
  deleteTweet,
} from "../services/tweetApi.js";

function timeAgo(dt) {
  try {
    if (!dt) return "";
    const d = new Date(dt);
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const day = Math.floor(h / 24);
    return `${day}d`;
  } catch {
    return "";
  }
}

export default function TweetCard({ tweet, disabledActions, onRequireAuth, onDeleted }) {
  const { t } = useAppSettings();
  const ref = useRef(null);

  const tweetId = tweet?.id;
  const meId = Number(localStorage.getItem("userId") || "0");
  const isMine = Boolean(tweet?.userId && meId && Number(tweet.userId) === meId);

  const authorName = tweet?.username || "user";
  const authorHandle = (tweet?.username || "user").toLowerCase();

  const [menuOpen, setMenuOpen] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [showCommentComposer, setShowCommentComposer] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  const [repostsOpen, setRepostsOpen] = useState(false);

  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [reposts, setReposts] = useState([]);

  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingReposts, setLoadingReposts] = useState(false);

  const [commentCount, setCommentCount] = useState(Number(tweet?.commentCount || 0));
  const [likeCount, setLikeCount] = useState(Number(tweet?.likeCount || 0));
  const [repostCount, setRepostCount] = useState(Number(tweet?.retweetCount || tweet?.repostCount || 0));

  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [retweetId, setRetweetId] = useState(null);

  const tSafe = (key, fallback) => {
    const v = t?.(key);
    return v && v !== key ? v : fallback;
  };

  const requireAuth = () => onRequireAuth?.("signin");

  const closeLists = () => {
    setCommentsOpen(false);
    setLikesOpen(false);
    setRepostsOpen(false);
  };

  const loadComments = async () => {
    if (!tweetId) return;
    setLoadingComments(true);
    try {
      const data = await fetchComments(tweetId);
      const arr = Array.isArray(data) ? data : [];
      setComments(arr);
      setCommentCount(arr.length);
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const loadLikes = async () => {
    if (!tweetId) return;
    setLoadingLikes(true);
    try {
      const data = await fetchLikes(tweetId);
      const arr = Array.isArray(data) ? data : [];
      setLikes(arr);
      setLikeCount(arr.length);
      const mine = arr.some((x) => Number(x.userId) === meId);
      setLiked(mine);
    } catch {
      setLikes([]);
    } finally {
      setLoadingLikes(false);
    }
  };

  const loadReposts = async () => {
    if (!tweetId) return;
    setLoadingReposts(true);
    try {
      const data = await fetchRetweets(tweetId);
      const arr = Array.isArray(data) ? data : [];
      setReposts(arr);
      setRepostCount(arr.length);
      const mine = arr.find((x) => Number(x.userId) === meId);
      setReposted(Boolean(mine));
      setRetweetId(mine?.id ?? null);
    } catch {
      setReposts([]);
    } finally {
      setLoadingReposts(false);
    }
  };

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    loadLikes();
    loadReposts();
  }, [tweetId]);

  const onCommentIconClick = async () => {
    if (disabledActions) return requireAuth();
    closeLists();
    setShowCommentComposer(true);
  };

  const onCommentsCountClick = async () => {
    closeLists();
    setShowCommentComposer(false);
    setCommentsOpen(true);
    await loadComments();
  };

  const onLikesCountClick = async () => {
    closeLists();
    setShowCommentComposer(false);
    setLikesOpen(true);
    await loadLikes();
  };

  const onRepostsCountClick = async () => {
    closeLists();
    setShowCommentComposer(false);
    setRepostsOpen(true);
    await loadReposts();
  };

  const onLikeIconClick = async () => {
    if (disabledActions) return requireAuth();
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => Math.max(0, c + (next ? 1 : -1)));
    try {
      if (next) await likeTweet(tweetId);
      else await dislikeTweet(tweetId);
      if (likesOpen) await loadLikes();
    } catch {
      setLiked(!next);
      setLikeCount((c) => Math.max(0, c + (!next ? 1 : -1)));
    }
  };

  const onRepostIconClick = async () => {
    if (disabledActions) return requireAuth();
    const next = !reposted;
    setReposted(next);
    setRepostCount((c) => Math.max(0, c + (next ? 1 : -1)));
    try {
      if (next) {
        const res = await createRetweet(tweetId);
        setRetweetId(res?.id ?? null);
      } else {
        if (retweetId != null) await deleteRetweet(retweetId);
        else await loadReposts();
        setRetweetId(null);
      }
      if (repostsOpen) await loadReposts();
    } catch {
      setReposted(!next);
      setRepostCount((c) => Math.max(0, c + (!next ? 1 : -1)));
    }
  };

  const onDeleteTweet = async () => {
    if (disabledActions) return requireAuth();
    try {
      await deleteTweet(tweetId);
      onDeleted?.(tweetId);
    } finally {
      setMenuOpen(false);
    }
  };

  const onSubmitComment = async () => {
    if (disabledActions) return requireAuth();
    const content = commentText.trim();
    if (!content || !tweetId) return;

    try {
      const created = await createComment(tweetId, content);
      setCommentText("");
      setShowCommentComposer(false);
      setCommentsOpen(true);
      setCommentCount((c) => c + 1);
      setComments((prev) => {
        const arr = Array.isArray(prev) ? prev : [];
        return [created, ...arr];
      });
      await loadComments();
    } catch {
      await loadComments();
    }
  };

  const canDeleteComment = (c) => {
    if (!c?.id) return false;
    const cid = Number(c.userId);
    const ownerId = Number(tweet?.userId);
    return Boolean(meId && (cid === meId || ownerId === meId));
  };

  const onDeleteCommentClick = async (commentId) => {
    if (disabledActions) return requireAuth();
    try {
      await deleteComment(commentId);
      setComments((prev) => (Array.isArray(prev) ? prev.filter((x) => x.id !== commentId) : prev));
      setCommentCount((c) => Math.max(0, c - 1));
    } catch {
      await loadComments();
    }
  };

  const tweetUrl = useMemo(() => {
    try {
      const origin = window.location.origin;
      return tweetId ? `${origin}/tweet/${tweetId}` : window.location.href;
    } catch {
      return "";
    }
  }, [tweetId]);

  const onShare = async () => {
    if (disabledActions) return requireAuth();
    try {
      await navigator.clipboard.writeText(tweetUrl || window.location.href);
    } catch {}
    setMenuOpen(false);
  };

  const menuItems = useMemo(() => {
    const items = [{ key: "copy", label: tSafe("tweet.copyLink", "Copy link"), onClick: onShare }];
    if (isMine) items.unshift({ key: "del", label: tSafe("tweet.delete", "Delete"), danger: true, onClick: onDeleteTweet });
    return items;
  }, [isMine, t, retweetId, tweetId]);

  const showDetails = showCommentComposer || commentsOpen || likesOpen || repostsOpen;

  return (
    <div className="xTweet">
      <div className="xAvatarSm" aria-hidden="true" />

      <div className="xTweetBody" ref={ref}>
        <div className="xTweetTopRow">
          <div className="xTweetName">{authorName}</div>
          <div className="xTweetHandle">@{authorHandle}</div>
          <div className="xTweetDot">·</div>
          <div className="xTweetTime">{timeAgo(tweet?.createdAt)}</div>

          <button className="xMoreBtn" type="button" onClick={() => setMenuOpen((p) => !p)} aria-label="More">
            <FiMoreHorizontal size={18} />
          </button>

          {menuOpen ? (
            <div className="xMenu" role="menu">
              {menuItems.map((it) => (
                <button
                  key={it.key}
                  className={`xMenuItem ${it.danger ? "danger" : ""}`}
                  type="button"
                  onClick={it.onClick}
                  role="menuitem"
                >
                  {it.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {tweet?.content ? <div className="xTweetText">{tweet.content}</div> : null}

        <div className="xTweetActions">
          <div className="xActGroup">
            <button className="xActBtn" type="button" onClick={onCommentIconClick} aria-label="Reply">
              <FiMessageCircle size={18} />
            </button>
            <button className="xActCountBtn" type="button" onClick={onCommentsCountClick} aria-label="View replies">
              {commentCount}
            </button>
          </div>

          <div className="xActGroup">
            <button className={`xActBtn ${reposted ? "isReposted" : ""}`} type="button" onClick={onRepostIconClick} aria-label="Repost">
              <FiRepeat size={18} />
            </button>
            <button className="xActCountBtn" type="button" onClick={onRepostsCountClick} aria-label="View reposts">
              {repostCount}
            </button>
          </div>

          <div className="xActGroup">
            <button className={`xActBtn ${liked ? "isLiked" : ""}`} type="button" onClick={onLikeIconClick} aria-label="Like">
              <FiHeart size={18} />
            </button>
            <button className="xActCountBtn" type="button" onClick={onLikesCountClick} aria-label="View likes">
              {likeCount}
            </button>
          </div>

          <button className="xActBtn" type="button" onClick={onShare} aria-label="Share">
            <FiShare size={18} />
          </button>
        </div>

        {showDetails ? (
          <div className="xTweetDetails">
            <div className="xDetailHeader">
              <button
                className="xMetaCloseIcon"
                type="button"
                aria-label="Close"
                onClick={() => {
                  closeLists();
                  setShowCommentComposer(false);
                }}
              >
                ×
              </button>
            </div>

            {!disabledActions && showCommentComposer ? (
              <div className="xCommentComposer">
                <textarea
                  className="xCommentInput"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={tSafe("tweet.replyPlaceholder", "Post your reply")}
                  rows={2}
                />
                <div className="xCommentActions">
                  <button className="xPrimaryBtn" type="button" onClick={onSubmitComment} disabled={!commentText.trim()}>
                    {tSafe("tweet.reply", "Reply")}
                  </button>
                </div>
              </div>
            ) : null}

            {commentsOpen ? (
              loadingComments ? (
                <div className="xDetailHint">{tSafe("loading", "Loading...")}</div>
              ) : comments.length ? (
                <div className="xDetailList">
                  {comments.map((c) => (
                    <div key={c.id} className="xDetailItem">
                      <div className="xDetailTitleRow">
                        <div className="xDetailTitle">@{(c.username || "user").toLowerCase()}</div>
                        {canDeleteComment(c) ? (
                          <button className="xMiniDangerBtn" type="button" onClick={() => onDeleteCommentClick(c.id)}>
                            {tSafe("common.delete", "Delete")}
                          </button>
                        ) : null}
                      </div>
                      <div className="xDetailText">{c.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="xDetailHint">{tSafe("tweet.noComments", "No comments yet")}</div>
              )
            ) : null}

            {repostsOpen ? (
              loadingReposts ? (
                <div className="xDetailHint">{tSafe("loading", "Loading...")}</div>
              ) : reposts.length ? (
                <div className="xDetailList">
                  {reposts.map((r) => (
                    <div key={r.id} className="xDetailItem">
                      <div className="xDetailTitle">@{(r.username || "user").toLowerCase()}</div>
                      <div className="xDetailText">{tSafe("tweet.reposted", "reposted")}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="xDetailHint">{tSafe("tweet.noReposts", "No reposts yet")}</div>
              )
            ) : null}

            {likesOpen ? (
              loadingLikes ? (
                <div className="xDetailHint">{tSafe("loading", "Loading...")}</div>
              ) : likes.length ? (
                <div className="xDetailList">
                  {likes.map((l) => (
                    <div key={l.id} className="xDetailItem">
                      <div className="xDetailTitle">@{(l.username || "user").toLowerCase()}</div>
                      <div className="xDetailText">{tSafe("tweet.liked", "liked")}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="xDetailHint">{tSafe("tweet.noLikes", "No likes yet")}</div>
              )
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
