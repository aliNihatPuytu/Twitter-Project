import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSettings } from "../context/AppSettingsContext.jsx";
import { fetchAllTweets, fetchMe } from "../services/tweetApi.js";
import TweetComposer from "../ui/TweetComposer.jsx";
import TweetCard from "../ui/TweetCard.jsx";

export default function HomePage() {
  const { lang } = useAppSettings();
  const navigate = useNavigate();

  const [tab, setTab] = useState("forYou");
  const [me, setMe] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const isAuthed = useMemo(() => {
    const token = localStorage.getItem("token");
    return !!token;
  }, []);

  useEffect(() => {
    if (!isAuthed) {
      navigate("/auth", { replace: true });
      return;
    }

    (async () => {
      try {
        setErr("");
        const data = await fetchMe();
        setMe(data);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        navigate("/auth", { replace: true });
      }
    })();
  }, [isAuthed, navigate]);

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const list = await fetchAllTweets();
      setTweets(Array.isArray(list) ? list : []);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Network error";
      setErr(msg);
      setTweets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthed) return;
    load();
  }, [isAuthed]);

  const onPosted = (created) => {
    if (!created) return;
    setTweets((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
    load();
  };

  const onDeleted = (tweetId) => {
    setTweets((prev) => (Array.isArray(prev) ? prev.filter((x) => x.id !== tweetId) : prev));
  };

  const showEmpty = !loading && !err && Array.isArray(tweets) && tweets.length === 0;
  const emptyText = lang === "tr" ? "Henüz gönderi yok." : "No posts yet.";

  return (
    <div className="xHome">
      <div className="xTabs">
        <button type="button" className={`xTab ${tab === "forYou" ? "active" : ""}`} onClick={() => setTab("forYou")}>
          {lang === "tr" ? "Sana özel" : "For you"}
        </button>

        <button type="button" className={`xTab ${tab === "following" ? "active" : ""}`} onClick={() => setTab("following")}>
          {lang === "tr" ? "Takip" : "Following"}
        </button>
      </div>

      <TweetComposer disabled={false} onRequireAuth={null} onPosted={onPosted} me={me} />

      {loading ? <div className="xInfo">...</div> : null}
      {err ? <div className="xError">{err}</div> : null}

      {showEmpty ? <div className="xInfo">{emptyText}</div> : null}

      <div className="xFeed">
        {(Array.isArray(tweets) ? tweets : []).map((tw) => (
          <TweetCard key={tw.id} tweet={tw} disabledActions={false} onRequireAuth={null} onDeleted={onDeleted} />
        ))}
      </div>
    </div>
  );
}
