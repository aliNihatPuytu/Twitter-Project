import { useOutletContext } from "react-router-dom";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import useGuestRedirect from "../hooks/useGuestRedirect.js";

export default function PremiumPage({ isAuthed }) {
  const { openAuth } = useOutletContext();
  const { t } = useAppSettings();
  useGuestRedirect(isAuthed);

  return (
    <div className="xCenterCol">
      <div className="xCenterHeader isScrolled">
        <div className="xTabs">
          <button className="xTab isActive" type="button">
            {t("nav.premium")}
          </button>
          <button className="xTab" type="button">
            {t("premium.features")}
          </button>
        </div>
      </div>

      <div className="xComposer">
        <div className="xTweetText">{t("premium.copy")}</div>
        {!isAuthed ? (
          <button className="xGuestHint" type="button" onClick={() => openAuth("signin")}>
            {t("common.continueSignIn")}
          </button>
        ) : null}
      </div>
    </div>
  );
}
