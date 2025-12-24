import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../api";
import TweetCard from "../ui/TweetCard.jsx";
import { fetchUserByUsername, fetchMe } from "../services/tweetApi.js";
import useGuestRedirect from "../hooks/useGuestRedirect.js";

function mapTweetDto(dto, myUserId) {
  const username = dto?.username || "user";
  const createdAt = dto?.createdAt ? new Date(dto.createdAt).getTime() : Date.now();
  return {
    id: dto?.id,
    text: dto?.content || "",
    createdAt,
    username,
    authorName: username,
    authorHandle: username.toLowerCase(),
    likeCount: dto?.likeCount || 0,
    repostCount: dto?.retweetCount || 0,
    commentCount: dto?.commentCount || 0,
    isMine: myUserId != null && dto?.userId != null ? Number(dto.userId) === Number(myUserId) : false,
  };
}

export default function ProfilePage({ isAuthed }) {
  const { openAuth, user } = useOutletContext();
  const { username: usernameParam } = useParams();

  if (!usernameParam) {
    useGuestRedirect(isAuthed);
  }

  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const myUserId = useMemo(() => {
    const stored = localStorage.getItem("userId");
    return user?.userId ?? (stored ? Number(stored) : null);
  }, [user]);

  const profileUsername = useMemo(() => {
    if (usernameParam) return usernameParam;
    return user?.username || localStorage.getItem("username") || "user";
  }, [usernameParam, user]);

  const profileLink = useMemo(() => {
    try {
      return `${window.location.origin}/u/${profileUsername}`;
    } catch {
      return "";
    }
  }, [profileUsername]);

  const onCopyProfile = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);
    } catch {}
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        let p = null;

        if (usernameParam) {
          p = await fetchUserByUsername(profileUsername);
        } else if (isAuthed) {
          try {
            p = await fetchMe();
          } catch {
            p = { id: myUserId, username: profileUsername };
          }
        } else {
          p = { id: null, username: profileUsername };
        }

        if (!mounted) return;
        setProfile(p);

        if (!p?.id) {
          setTweets([]);
          return;
        }

        const res = await api.get("/tweet/findByUserId", { params: { userId: p.id } });
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const mapped = list
          .map((dto) => mapTweetDto(dto, myUserId))
          .filter((x) => x.id != null)
          .sort((a, b) => b.createdAt - a.createdAt);

        if (!mounted) return;
        setTweets(mapped);
      } catch {
        if (!mounted) return;
        setErr("Profil yüklenemedi");
        setTweets([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [profileUsername, usernameParam, isAuthed, myUserId]);

  return (
    <div className="xCenterCol">
      <div className="xCenterHeader isScrolled" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontWeight: 700 }}>@{profileUsername}</div>
        <button className="xPrimaryBtn" type="button" onClick={onCopyProfile} style={{ padding: "8px 12px" }}>
          Profili kopyala
        </button>
      </div>

      {!isAuthed && !usernameParam ? (
        <div className="xComposer">
          <div className="xMuted">Profilini görmek için giriş yap</div>
          <button className="xGuestHint" type="button" onClick={() => openAuth("signin")}>
            Continue to sign in
          </button>
        </div>
      ) : null}

      {loading ? <div style={{ padding: 16 }}>Yükleniyor…</div> : null}
      {err ? <div style={{ padding: 16 }}>{err}</div> : null}

      {!loading && !err && profile?.id && !tweets.length ? (
        <div style={{ padding: 16 }}>Henüz tweet yok</div>
      ) : null}

      {tweets.map((tw) => (
        <TweetCard
          key={tw.id}
          tweet={tw}
          disabledActions={!isAuthed}
          onRequireAuth={() => openAuth("signin")}
        />
      ))}
    </div>
  );
}
