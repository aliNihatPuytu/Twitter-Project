import { useEffect, useMemo, useRef, useState } from "react";
import { FiHeart, FiMessageCircle, FiRepeat, FiShare, FiMoreHorizontal } from "react-icons/fi";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import {
  likeTweet,
  dislikeTweet,
  createRetweet,
  deleteRetweet,
  createComment,
  fetchComments,
  fetchRetweets,
  fetchLikes,
} from "../services/tweetApi.js";

function toMillis(v) {
  if (v == null) return Date.now();
  if (typeof v === "number") return v;
  const n = Number(v);
  if (!Number.isNaN(n)) return n;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? Date.now() : t;
}

function timeAgo(ts) {
  const base = toMillis(ts);
  const sec = Math.floor((Date.now() - base) / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default function TweetCard({ tweet, disabledActions, onRequireAuth, onDeleted }) {
  const { t, lang } = useAppSettings();

  const tSafe = (key, fallback) => {
    const v = t?.(key);
    return v && v !== key ? v : fallback;
  };

  const tweetId = tweet?.id ?? tweet?.tweetId ?? tweet?._id;

  const [liked, setLiked] = useState(Boolean(tweet?.liked ?? tweet?.isLiked));
  const [reposted, setReposted] = useState(Boolean(tweet?.reposted ?? tweet?.isReposted));
  const [retweetId, setRetweetId] = useState(tweet?.retweetId ?? null);

  const [likeCount, setLikeCount] = useState(Number(tweet?.likeCount ?? 0));
  const [repostCount, setRepostCount] = useState(Number(tweet?.repostCount ?? tweet?.retweetCount ?? 0));
  const [commentCount, setCommentCount] = useState(Number(tweet?.commentCount ?? 0));

  const [menuOpen, setMenuOpen] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  const [repostsOpen, setRepostsOpen] = useState(false);

  const [showCommentComposer, setShowCommentComposer] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [reposts, setReposts] = useState([]);

  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingReposts, setLoadingReposts] = useState(false);

  const ref = useRef(null);

  const authorName = tweet?.authorName || tweet?.username || "user";
  const authorHandle = (tweet?.authorHandle || tweet?.handle || tweet?.username || "user").toLowerCase();

  const isMine = Boolean(tweet?.isMine);

  const createdAt = tweet?.createdAt ?? tweet?.created_at ?? tweet?.date;

  const bodyText = useMemo(() => {
    const v = (tweet?.content ?? tweet?.text ?? "").toString();
    return v.trim();
  }, [tweet?.content, tweet?.text]);

  const requireAuth = () => onRequireAuth?.("signin");

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (ref.current.contains(e.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    setLiked(Boolean(tweet?.liked ?? tweet?.isLiked));
    setReposted(Boolean(tweet?.reposted ?? tweet?.isReposted));
    setRetweetId(tweet?.retweetId ?? null);

    setLikeCount(Number(tweet?.likeCount ?? 0));
    setRepostCount(Number(tweet?.repostCount ?? tweet?.retweetCount ?? 0));
    setCommentCount(Number(tweet?.commentCount ?? 0));

    setComments([]);
    setLikes([]);
    setReposts([]);

    setCommentsOpen(false);
    setLikesOpen(false);
    setRepostsOpen(false);

    setShowCommentComposer(false);
    setCommentText("");
  }, [tweetId]);

  const closeLists = () => {
    setCommentsOpen(false);
    setLikesOpen(false);
    setRepostsOpen(false);
  };

  const openOnlyList = (panel) => {
    setCommentsOpen(panel === "comments");
    setLikesOpen(panel === "likes");
    setRepostsOpen(panel === "reposts");
    setMenuOpen(false);
  };

  const loadComments = async () => {
    if (!tweetId) return;
    setLoadingComments(true);
    try {
      const data = await fetchComments(tweetId);
      setComments(Array.isArray(data) ? data : []);
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
      setLikes(Array.isArray(data) ? data : []);
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
      setReposts(Array.isArray(data) ? data : []);
    } catch {
      setReposts([]);
    } finally {
      setLoadingReposts(false);
    }
  };

  const onCommentsCountClick = async () => {
    if (commentsOpen) {
      setCommentsOpen(false);
      return;
    }
    openOnlyList("comments");
    await loadComments();
  };

  const onLikesCountClick = async () => {
    if (likesOpen) {
      setLikesOpen(false);
      return;
    }
    openOnlyList("likes");
    await loadLikes();
  };

  const onRepostsCountClick = async () => {
    if (repostsOpen) {
      setRepostsOpen(false);
      return;
    }
    openOnlyList("reposts");
    await loadReposts();
  };

  const onCommentIconClick = async () => {
    if (disabledActions) return requireAuth();
    setShowCommentComposer((p) => !p);
  };

  const onLikeIconClick = async () => {
    if (disabledActions) return requireAuth();
    if (!tweetId) return;

    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
      try {
        await likeTweet(tweetId);
        if (likesOpen) await loadLikes();
      } catch {
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      }
      return;
    }

    setLiked(false);
    setLikeCount((c) => Math.max(0, c - 1));
    try {
      await dislikeTweet(tweetId);
      if (likesOpen) await loadLikes();
    } catch {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const onRepostIconClick = async () => {
    if (disabledActions) return requireAuth();
    if (!tweetId) return;

    if (!reposted) {
      setReposted(true);
      setRepostCount((c) => c + 1);
      try {
        const res = await createRetweet(tweetId);
        const rid = res?.id ?? null;
        setRetweetId(rid);
        if (repostsOpen) await loadReposts();
      } catch {
        setReposted(false);
        setRepostCount((c) => Math.max(0, c - 1));
      }
      return;
    }

    setReposted(false);
    setRepostCount((c) => Math.max(0, c - 1));
    try {
      if (retweetId != null) await deleteRetweet(retweetId);
      setRetweetId(null);
      if (repostsOpen) await loadReposts();
    } catch {
      setReposted(true);
      setRepostCount((c) => c + 1);
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

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tweetUrl || window.location.href);
    } catch {}
    setMenuOpen(false);
  };

  const onShare = async () => {
    if (disabledActions) return requireAuth();
    try {
      await navigator.clipboard.writeText(tweetUrl || window.location.href);
    } catch {}
    setMenuOpen(false);
  };

  const onDelete = () => {
    if (disabledActions) return requireAuth();
    onDeleted?.(tweetId);
    setMenuOpen(false);
  };

  const onSubmitComment = async () => {
    if (disabledActions) return requireAuth();
    const content = commentText.trim();
    if (!content || !tweetId) return;

    try {
      const created = await createComment(tweetId, content);
      setCommentText("");
      setCommentCount((c) => c + 1);

      if (commentsOpen) {
        setComments((prev) => {
          const arr = Array.isArray(prev) ? prev : [];
          return [created, ...arr];
        });
      }
    } catch {}
  };

  const menuItems = useMemo(() => {
    const items = [{ key: "copy", label: tSafe("tweet.copyLink", "Copy link"), onClick: onCopyLink }];
    if (isMine) items.unshift({ key: "del", label: tSafe("tweet.delete", "Delete"), danger: true, onClick: onDelete });
    return items;
  }, [isMine, lang, t]);

  const showDetails = showCommentComposer || commentsOpen || likesOpen || repostsOpen;

  return (
    <div className="xTweet">
      <div className="xAvatarSm" aria-hidden="true" />

      <div className="xTweetBody" ref={ref}>
        <div className="xTweetTopRow">
          <div className="xTweetName">{authorName}</div>
          <div className="xTweetHandle">@{authorHandle}</div>
          <div className="xTweetDot">·</div>
          <div className="xTweetTime">{timeAgo(createdAt)}</div>

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

        {bodyText ? <div className="xTweetText">{bodyText}</div> : null}

        <div className="xTweetActions">
          <button
            className="xActBtn"
            type="button"
            data-action="comment"
            onClick={onCommentIconClick}
            aria-label="Reply"
          >
            <FiMessageCircle size={18} />
            <span
              className="xActCount isClickable"
              onClick={(e) => {
                e.stopPropagation();
                onCommentsCountClick();
              }}
              title="View replies"
            >
              {commentCount}
            </span>
          </button>

          <button
            className={`xActBtn ${reposted ? "isReposted" : ""}`}
            type="button"
            data-action="retweet"
            onClick={onRepostIconClick}
            aria-label="Repost"
          >
            <FiRepeat size={18} />
            <span
              className="xActCount isClickable"
              onClick={(e) => {
                e.stopPropagation();
                onRepostsCountClick();
              }}
              title="View reposts"
            >
              {repostCount}
            </span>
          </button>

          <button
            className={`xActBtn ${liked ? "isLiked" : ""}`}
            type="button"
            data-action="like"
            onClick={onLikeIconClick}
            aria-label="Like"
          >
            <FiHeart size={18} />
            <span
              className="xActCount isClickable"
              onClick={(e) => {
                e.stopPropagation();
                onLikesCountClick();
              }}
              title="View likes"
            >
              {likeCount}
            </span>
          </button>

          <button className="xActBtn" type="button" data-action="share" onClick={onShare} aria-label="Share">
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
                      <div className="xDetailTitle">@{(c.username || "user").toLowerCase()}</div>
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
