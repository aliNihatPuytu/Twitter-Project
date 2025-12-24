import { useOutletContext } from "react-router-dom";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import useGuestRedirect from "../hooks/useGuestRedirect.js";

export default function MessagesPage({ isAuthed }) {
  const { openAuth } = useOutletContext();
  const { t } = useAppSettings();
  useGuestRedirect(isAuthed);

  return (
    <div className="xCenterCol">
      <div className="xCenterHeader isScrolled">
        <div className="xTabs">
          <button className="xTab isActive" type="button">
            {t("nav.messages")}
          </button>
          <button className="xTab" type="button">
            {t("messages.requests")}
          </button>
        </div>
      </div>

      {!isAuthed ? (
        <div className="xComposer">
          <div className="xMuted">{t("messages.guestInfo")}</div>
          <button className="xGuestHint" type="button" onClick={() => openAuth("signin")}>
            {t("common.continueSignIn")}
          </button>
        </div>
      ) : (
        <div className="xFeed">
          <div className="xTweet">
            <div className="xTweetBody">
              <div className="xTweetText">{t("messages.empty")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
