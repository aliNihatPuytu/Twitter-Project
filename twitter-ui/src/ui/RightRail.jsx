import { useEffect, useMemo, useState } from "react";
import { FiMoreHorizontal, FiSearch } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import SettingsToggles from "./SettingsToggles.jsx";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import { getFollowed, isFollowed, onFollowChanged, toggleFollow } from "../services/followStore.js";

export default function RightRail() {
  const { t, lang } = useAppSettings();
  const [followed, setFollowed] = useState(() => getFollowed());

  useEffect(() => onFollowChanged(setFollowed), []);

  const tSafe = (key, fallback) => {
    const v = t?.(key);
    return v && v !== key ? v : fallback;
  };

  const trends =
    lang === "tr"
      ? [
          { meta: "Eğlence · Gündemdekiler", title: "Okan Bayülgen", count: "1.884 gönderi" },
          { meta: "Türkiye tarihinde gündemde", title: "Rus İHA", count: "" },
          { meta: "Türkiye tarihinde gündemde", title: "Insider", count: "45,6 B gönderi" },
        ]
      : [
          { meta: "Entertainment · Trending", title: "Okan Bayülgen", count: "1,884 posts" },
          { meta: "Trending in Türkiye", title: "Russian UAV", count: "" },
          { meta: "Trending in Türkiye", title: "Insider", count: "45.6K posts" },
        ];

  const suggestions =
    lang === "tr"
      ? [
          { name: "büşra", handle: "bgsuap", verified: false },
          { name: "Fsychox", handle: "fsychox", verified: false },
          { name: "Özgür", handle: "ozgurru", verified: true },
        ]
      : [
          { name: "Büşra", handle: "bgsuap", verified: false },
          { name: "Fsychox", handle: "fsychox", verified: false },
          { name: "Özgür", handle: "ozgurru", verified: true },
        ];

  const followBtnText = useMemo(() => {
    const v = t?.("common.followBtn");
    if (v && v !== "common.followBtn") return v;
    return lang === "tr" ? "Takip et" : "Follow";
  }, [lang, t]);

  const followingBtnText = useMemo(() => {
    const v = t?.("common.followingBtn");
    if (v && v !== "common.followingBtn") return v;
    return lang === "tr" ? "Takip ediliyor" : "Following";
  }, [lang, t]);

  return (
    <div className="xRightInner">
      <div className="xSearchWrap">
        <div className="xSearchRow">
          <div className="xSearchBar">
            <div className="xSearchIcon">
              <FiSearch size={18} />
            </div>
            <input className="xSearchInput" placeholder={tSafe("common.search", lang === "tr" ? "Ara" : "Search")} />
          </div>

          <SettingsToggles />
        </div>
      </div>

      <div className="xCard">
        <div className="xCardHeader">{tSafe("common.subscribeTitle", lang === "tr" ? "Premium’a abone ol" : "Subscribe to Premium")}</div>
        <div className="xCardBody">
          <div className="xCardText">
            {tSafe(
              "common.subscribeText",
              lang === "tr"
                ? "Yeni özellikleri açmak için abone ol ve uygun olman durumunda içerik üreticisi gelir payı kazan."
                : "Subscribe to unlock new features and, if eligible, earn a share of creator revenue."
            )}
          </div>
          <button className="xPrimaryBtn" type="button">
            {tSafe("common.subscribeBtn", lang === "tr" ? "Abone ol" : "Subscribe")}
          </button>
        </div>
      </div>

      <div className="xCard">
        <div className="xCardHeader">{tSafe("common.whatsHappening", lang === "tr" ? "Neler oluyor?" : "What’s happening")}</div>

        <div className="xList">
          {trends.map((tr) => (
            <button key={tr.title} className="xListItem" type="button">
              <div>
                <div className="xListMeta">{tr.meta}</div>
                <div className="xListTitle">{tr.title}</div>
                {tr.count ? <div className="xListMeta">{tr.count}</div> : null}
              </div>
              <div className="xListRight">
                <FiMoreHorizontal size={18} />
              </div>
            </button>
          ))}
        </div>

        <button className="xCardLink" type="button">
          {tSafe("common.showMore", lang === "tr" ? "Daha fazla göster" : "Show more")}
        </button>
      </div>

      <div className="xCard">
        <div className="xCardHeader">{tSafe("common.whoToFollow", lang === "tr" ? "Kimi takip etmeli" : "Who to follow")}</div>

        <div className="xFollowList">
          {suggestions.map((u) => {
            const followedNow = isFollowed(u.handle);
            return (
              <div key={u.handle} className="xFollowRow">
                <div className="xFollowAvatar" aria-hidden="true" />
                <div className="xFollowText">
                  <div className="xFollowNameRow">
                    <div className="xFollowName">{u.name}</div>
                    {u.verified ? <FaCheckCircle className="xVerified" size={14} /> : null}
                  </div>
                  <div className="xFollowHandle">@{u.handle}</div>
                </div>

                <button
                  className={`xFollowBtn ${followedNow ? "isFollowing" : ""}`}
                  type="button"
                  onClick={() => {
                    const next = toggleFollow(u.handle);
                    setFollowed(next);
                  }}
                >
                  {followedNow ? followingBtnText : followBtnText}
                </button>
              </div>
            );
          })}
        </div>

        <button className="xCardLink" type="button">
          {tSafe("common.showMore", lang === "tr" ? "Daha fazla göster" : "Show more")}
        </button>
      </div>

      <div className="xRightFooter">
        <span>{lang === "tr" ? "Hizmet Şartları" : "Terms"}</span>
        <span>{lang === "tr" ? "Gizlilik Politikası" : "Privacy"}</span>
        <span>{lang === "tr" ? "Çerez Politikası" : "Cookies"}</span>
        <span>{lang === "tr" ? "Erişilebilirlik" : "Accessibility"}</span>
        <span>{lang === "tr" ? "Reklam bilgisi" : "Ads info"}</span>
        <span>{lang === "tr" ? "Daha fazla…" : "More…"} </span>
      </div>
    </div>
  );
}
