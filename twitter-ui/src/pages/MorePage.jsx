import { useOutletContext, useNavigate } from "react-router-dom";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import useGuestRedirect from "../hooks/useGuestRedirect.js";

export default function MorePage({ isAuthed, setUser }) {
  const { openAuth } = useOutletContext();
  const { t, theme, setTheme, lang, setLang } = useAppSettings();
  const navigate = useNavigate();

  useGuestRedirect(isAuthed);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser?.(null);
    navigate("/");
  };

  return (
    <div className="xCenterCol">
      <div className="xCenterHeader isScrolled">
        <div className="xTabs">
          <button className="xTab isActive" type="button">
            {t("nav.more")}
          </button>
          <button className="xTab" type="button">
            {t("more.settings")}
          </button>
        </div>
      </div>

      <div className="xComposer">
        <div className="xTweetText" style={{ marginBottom: 10 }}>
          {t("more.quickSettings")}
        </div>

        <div className="xSettingsRow">
          <button
            className="xPillBtn"
            type="button"
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
          >
            {lang.toUpperCase()}
          </button>

          <button
            className="xPillBtn"
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☾" : "☀"}
          </button>
        </div>

        {!isAuthed ? (
          <button className="xGuestHint" type="button" onClick={() => openAuth("signin")}>
            {t("common.continueSignIn")}
          </button>
        ) : (
          <button className="xGuestHint" type="button" onClick={logout}>
            {t("common.logout")}
          </button>
        )}
      </div>
    </div>
  );
}
