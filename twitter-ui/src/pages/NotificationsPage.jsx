import { useOutletContext } from "react-router-dom";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import useGuestRedirect from "../hooks/useGuestRedirect.js";

export default function NotificationsPage({ isAuthed }) {
  const { openAuth } = useOutletContext();
  const { t } = useAppSettings();
  useGuestRedirect(isAuthed);

  return (
    <div className="xCenterCol">
      <div className="xCenterHeader isScrolled">
        <div className="xTabs">
          <button className="xTab isActive" type="button">
            {t("nav.notifications")}
          </button>
          <button className="xTab" type="button">
            {t("notifications.mentions")}
          </button>
        </div>
      </div>

      {!isAuthed ? (
        <div className="xComposer">
          <div className="xMuted">{t("notifications.guestInfo")}</div>
          <button className="xGuestHint" type="button" onClick={() => openAuth("signin")}>
            {t("common.continueSignIn")}
          </button>
        </div>
      ) : (
        <div className="xFeed">
          <div className="xTweet">
            <div className="xAvatarSm" aria-hidden="true" />
            <div className="xTweetBody">
              <div className="xTweetText">{t("notifications.sample1")}</div>
            </div>
          </div>
          <div className="xTweet">
            <div className="xAvatarSm" aria-hidden="true" />
            <div className="xTweetBody">
              <div className="xTweetText">{t("notifications.sample2")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
