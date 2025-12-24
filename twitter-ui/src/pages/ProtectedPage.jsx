import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAppSettings } from "../context/AppSettingsContext.jsx";

export default function ProtectedPage({ pageKey }) {
  const { t } = useAppSettings();
  const { isAuthed, openAuth } = useOutletContext();
  const navigate = useNavigate();

  // X gibi: guest bir süre sonra /auth’a yönlensin
  useEffect(() => {
    if (isAuthed) return;
    const timer = setTimeout(() => navigate("/auth"), 16000);
    return () => clearTimeout(timer);
  }, [isAuthed, navigate]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontWeight: 900, fontSize: 22 }}>{t(pageKey)}</div>

      {!isAuthed ? (
        <>
          <div style={{ marginTop: 10, color: "var(--muted)", fontWeight: 700 }}>
            Devam etmek için giriş yapmalısın.
          </div>
          <button className="xGuestHint" type="button" onClick={() => openAuth("signin")}>
            {t("common.continueSignIn")}
          </button>
        </>
      ) : (
        <div style={{ marginTop: 10, color: "var(--muted)", fontWeight: 700 }}>
          (Bu sayfanın içeriğini sonra dolduracağız.)
        </div>
      )}
    </div>
  );
}
