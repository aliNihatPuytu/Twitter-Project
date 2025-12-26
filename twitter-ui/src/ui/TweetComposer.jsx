import { useEffect, useMemo, useRef, useState } from "react";
import { FiImage, FiBarChart2, FiSmile, FiCalendar, FiMapPin, FiX } from "react-icons/fi";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import { createTweet } from "../services/tweetApi.js";

export default function TweetComposer({ disabled, onRequireAuth, onPosted, me }) {
  const { t, lang } = useAppSettings();

  const [text, setText] = useState("");
  const [panel, setPanel] = useState(null);
  const [poll, setPoll] = useState({ q: "", a: "", b: "" });
  const [pickedEmoji, setPickedEmoji] = useState("");
  const [schedule, setSchedule] = useState("");
  const [location, setLocation] = useState("");
  const [mediaUrls, setMediaUrls] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  const canPost = useMemo(() => {
    const base = text.trim().length > 0;
    const extra = pickedEmoji || schedule || location || mediaUrls.length > 0;
    return base || extra;
  }, [text, pickedEmoji, schedule, location, mediaUrls.length]);

  const tSafe = (key, fallback) => {
    const v = t?.(key);
    return v && v !== key ? v : fallback;
  };

  const requireAuth = () => {
    onRequireAuth?.("signin");
  };

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = files.slice(0, 4).map((f) => URL.createObjectURL(f));
    setMediaUrls((prev) => [...prev, ...urls].slice(0, 4));
    e.target.value = "";
  };

  const removeMedia = (url) => setMediaUrls((prev) => prev.filter((x) => x !== url));

  const post = async () => {
    if (disabled) return requireAuth();
    if (!canPost) return;
    if (sending) return;

    const extra = [];
    if (pickedEmoji) extra.push(pickedEmoji);
    if (location) extra.push(`📍 ${location}`);
    if (schedule) extra.push(`🗓️ ${schedule}`);
    const suffix = extra.length ? `\n\n${extra.join("\n")}` : "";

    const payload = `${text.trim()}${suffix}`.trim();

    try {
      setError("");
      setSending(true);
      const created = await createTweet(payload);
      onPosted?.(created);
      setText("");
      setPanel(null);
      setPoll({ q: "", a: "", b: "" });
      setPickedEmoji("");
      setSchedule("");
      setLocation("");
      setMediaUrls([]);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Network error";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const onCompose = () => {
      textareaRef.current?.focus();
    };
    window.addEventListener("x:compose", onCompose);
    return () => window.removeEventListener("x:compose", onCompose);
  }, []);

  const mediaClass =
    mediaUrls.length === 1 ? "c1" : mediaUrls.length === 2 ? "c2" : mediaUrls.length === 3 ? "c3" : "c4";

  return (
    <div className="xComposer">
      <div className="xComposerRow">
        <div className="xAvatarSm" aria-hidden="true" />

        <div className="xComposerMain">
          <textarea
            ref={textareaRef}
            className="xComposerInput"
            placeholder={tSafe("common.whatsHappening", lang === "tr" ? "Neler oluyor?" : "What’s happening?")}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {panel === "poll" ? (
            <div className="xMiniPanel">
              <div className="xMiniRow">
                <div className="xMiniCol">
                  <div className="xMiniHint">{lang === "tr" ? "Soru" : "Question"}</div>
                  <input
                    className="xCommentInput"
                    value={poll.q}
                    onChange={(e) => setPoll((p) => ({ ...p, q: e.target.value }))}
                  />
                </div>
              </div>
              <div className="xMiniRow">
                <div className="xMiniCol">
                  <div className="xMiniHint">{lang === "tr" ? "Seçenek 1" : "Option 1"}</div>
                  <input
                    className="xCommentInput"
                    value={poll.a}
                    onChange={(e) => setPoll((p) => ({ ...p, a: e.target.value }))}
                  />
                </div>
                <div className="xMiniCol">
                  <div className="xMiniHint">{lang === "tr" ? "Seçenek 2" : "Option 2"}</div>
                  <input
                    className="xCommentInput"
                    value={poll.b}
                    onChange={(e) => setPoll((p) => ({ ...p, b: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {panel === "emoji" ? (
            <div className="xMiniPanel">
              <div className="xChipRow">
                {["😀", "😂", "🥹", "😎", "🔥", "✨", "💡", "🎯", "💙", "💚", "💗", "🙏"].map((e) => (
                  <button
                    key={e}
                    type="button"
                    className="xChip"
                    onClick={() => {
                      setPickedEmoji(e);
                      setPanel(null);
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {panel === "schedule" ? (
            <div className="xMiniPanel">
              <div className="xMiniHint">{lang === "tr" ? "Zamanla" : "Schedule"}</div>
              <input
                className="xCommentInput"
                type="datetime-local"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              />
            </div>
          ) : null}

          {panel === "location" ? (
            <div className="xMiniPanel">
              <div className="xMiniHint">{lang === "tr" ? "Konum" : "Location"}</div>
              <input className="xCommentInput" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          ) : null}

          {mediaUrls.length ? (
            <div className={`xMediaGrid ${mediaClass}`}>
              {mediaUrls.map((url) => (
                <div key={url} className="xMediaCell">
                  <img src={url} alt="" className="xMediaImg" />
                  <button className="xMediaRemove" type="button" onClick={() => removeMedia(url)}>
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {error ? <div className="xComposeError">{error}</div> : null}

          <div className="xComposerBottom">
            <div className="xChipRow">
              <button className="xIconBtn" type="button" onClick={() => fileRef.current?.click()}>
                <FiImage />
              </button>
              <button className="xIconBtn" type="button" onClick={() => setPanel((p) => (p === "poll" ? null : "poll"))}>
                <FiBarChart2 />
              </button>
              <button className="xIconBtn" type="button" onClick={() => setPanel((p) => (p === "emoji" ? null : "emoji"))}>
                <FiSmile />
              </button>
              <button
                className="xIconBtn"
                type="button"
                onClick={() => setPanel((p) => (p === "schedule" ? null : "schedule"))}
              >
                <FiCalendar />
              </button>
              <button
                className="xIconBtn"
                type="button"
                onClick={() => setPanel((p) => (p === "location" ? null : "location"))}
              >
                <FiMapPin />
              </button>

              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={onFiles} />
            </div>

            <button className="xSendBtn" type="button" onClick={post} disabled={disabled || !canPost || sending}>
              {tSafe("common.post", lang === "tr" ? "Gönder" : "Post")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
