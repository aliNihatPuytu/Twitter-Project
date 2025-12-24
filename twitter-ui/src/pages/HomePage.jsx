import { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api";
import TweetComposer from "../ui/TweetComposer.jsx";
import TweetCard from "../ui/TweetCard.jsx";
import { useAppSettings } from "../context/AppSettingsContext.jsx";

function getFollowed() {
  try {
    const raw = localStorage.getItem("followedUsers");
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const { isAuthed, user, openAuth } = useOutletContext();
  const { t } = useAppSettings();

  const [tab, setTab] = useState("forYou");
  const [tweets, setTweets] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [followed, setFollowed] = useState(() => getFollowed());

  const feedUserId = useMemo(() => {
    const stored = localStorage.getItem("lastFeedUserId");
    const meId = localStorage.getItem("userId");
    return stored || meId || "1";
  }, []);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const visibleTweets = useMemo(() => {
    if (tab === "following") {
      if (!followed?.length) return [];
      return tweets.filter((tw) => followed.includes(Number(tw.userId ?? tw.user?.id ?? tw.user?.userId)));
    }
    return tweets;
  }, [tab, tweets, followed]);

  const load = useCallback(async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await api.get("/tweet/findByUserId", { params: { userId: Number(feedUserId) } });
      setTweets(Array.isArray(res?.data) ? res.data : []);
      localStorage.setItem("lastFeedUserId", String(feedUserId));
      setFollowed(getFollowed());
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Network error";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }, [feedUserId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onPosted = async () => {
    await load();
  };

  const onDeleted = async (id) => {
    if (!id) return;
    try {
      await api.delete(`/tweet/${id}`);
      setTweets((prev) => prev.filter((tw) => (tw.id ?? tw.tweetId ?? tw._id) !== id));
    } catch {}
  };

  return (
    <div className="xCenterCol">
      <div className={`xCenterHeader ${scrolled ? "isScrolled" : ""}`}>
        <div className="xTabs">
          <button
            className={`xTab ${tab === "forYou" ? "isActive" : ""}`}
            type="button"
            onClick={() => setTab("forYou")}
          >
            {t("common.forYou")}
          </button>

          <button
            className={`xTab ${tab === "following" ? "isActive" : ""}`}
            type="button"
            onClick={() => setTab("following")}
          >
            {t("common.following")}
          </button>
        </div>
      </div>

      <TweetComposer disabled={!isAuthed} onRequireAuth={openAuth} onPosted={onPosted} me={user} />

      {err ? <div className="xInlineError">{err}</div> : null}
      {loading ? <div className="xLoading">{t("common.loading")}</div> : null}

      {!loading && visibleTweets.length ? (
        <div className="xFeed">
          {visibleTweets.map((tw) => (
            <TweetCard
              key={tw.id ?? tw.tweetId ?? tw._id ?? Math.random()}
              tweet={tw}
              me={user}
              isAuthed={isAuthed}
              onRequireAuth={openAuth}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      ) : null}

      {!loading && !visibleTweets.length && !isAuthed ? (
        <button className="xGuestHint" type="button" onClick={() => openAuth("signin")}>
          {t("common.continueSignIn")}
        </button>
      ) : null}
    </div>
  );
}
