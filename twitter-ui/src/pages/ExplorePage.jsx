import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import useGuestRedirect from "../hooks/useGuestRedirect.js";

const sampleUsers = [
  { name: "Büşra", handle: "bgsuap" },
  { name: "Fsychox", handle: "fsychox" },
  { name: "Özgür", handle: "ozgurru" },
  { name: "ali", handle: "ali" },
];

const sampleTweets = [
  { id: 1, name: "Büşra", handle: "bgsuap", text: "Bugün yeni bir şey deniyorum 🙂" },
  { id: 2, name: "Fsychox", handle: "fsychox", text: "UI çok daha iyi oldu. Sırada Following feed var." },
  { id: 3, name: "Özgür", handle: "ozgurru", text: "Repost ve yorum akışını da ekleyelim." },
  { id: 4, name: "ali", handle: "ali", text: "Deneme 1" },
];

export default function ExplorePage({ isAuthed }) {
  const { openAuth } = useOutletContext();
  const { t } = useAppSettings();
  useGuestRedirect(isAuthed);

  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return { users: sampleUsers, tweets: sampleTweets };
    return {
      users: sampleUsers.filter(
        (u) => u.name.toLowerCase().includes(query) || u.handle.toLowerCase().includes(query)
      ),
      tweets: sampleTweets.filter(
        (tw) =>
          tw.text.toLowerCase().includes(query) ||
          tw.name.toLowerCase().includes(query) ||
          tw.handle.toLowerCase().includes(query)
      ),
    };
  }, [q]);

  return (
    <div className="xCenterCol">
      <div className="xCenterHeader isScrolled">
        <div className="xTabs">
          <button className="xTab isActive" type="button">
            {t("explore.title")}
          </button>
          <button className="xTab" type="button" onClick={() => openAuth("signin")}>
            {t("explore.people")}
          </button>
        </div>
      </div>

      <div className="xComposer">
        <div className="xSearchBar" style={{ gridTemplateColumns: "44px 1fr" }}>
          <div className="xSearchIcon">⌕</div>
          <input
            className="xSearchInput"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("explore.searchPlaceholder")}
          />
        </div>

        {!isAuthed ? (
          <button className="xGuestHint" type="button" onClick={() => openAuth("signin")}>
            {t("common.continueSignIn")}
          </button>
        ) : null}
      </div>

      <div className="xFeed">
        <div className="xTweet">
          <div className="xAvatarSm" aria-hidden="true" />
          <div className="xTweetBody">
            <div className="xTweetTopRow">
              <div className="xTweetName">{t("explore.users")}</div>
            </div>
            <div className="xTweetText">
              {results.users.map((u) => (
                <div key={u.handle} style={{ padding: "6px 0" }}>
                  <strong>{u.name}</strong> <span className="xMuted">@{u.handle}</span>
                </div>
              ))}
              {!results.users.length ? <div className="xMuted">{t("explore.noResults")}</div> : null}
            </div>
          </div>
        </div>

        {results.tweets.map((tw) => (
          <div key={tw.id} className="xTweet">
            <div className="xAvatarSm" aria-hidden="true" />
            <div className="xTweetBody">
              <div className="xTweetTopRow">
                <div className="xTweetName">{tw.name}</div>
                <div className="xTweetHandle">@{tw.handle}</div>
                <div className="xTweetDot">·</div>
                <div className="xTweetTime">1m</div>
              </div>
              <div className="xTweetText">{tw.text}</div>
            </div>
          </div>
        ))}

        {!results.tweets.length ? (
          <div className="xTweet">
            <div className="xTweetBody">
              <div className="xMuted">{t("explore.noResults")}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
