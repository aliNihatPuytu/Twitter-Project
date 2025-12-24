import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal.jsx";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import xDark from "../assets/twitter-dark.png";
import xLight from "../assets/twitter-light.png";

export default function AuthPage({ user, setUser }) {
  const { t, theme } = useAppSettings();
  const navigate = useNavigate();
  const logo = theme === "dark" ? xDark : xLight;

  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState("signin");

  const isAuthed = useMemo(() => Boolean(user?.token || localStorage.getItem("token")), [user]);

  const onAuth = (payload) => {
const token = payload?.token || localStorage.getItem("token");

const storedId = Number(localStorage.getItem("userId") || "0");
const userId = payload?.userId ?? (Number(localStorage.getItem("userId") || "0") || null);npm

const username = payload?.username || localStorage.getItem("username") || "user";

setUser?.(token ? { token, userId, username } : null);
setOpen(false);
    navigate("/");
  };

  if (isAuthed) {
    navigate("/");
    return null;
  }

  return (
    <div className="xAuthShell">
      <div className="xAuthPage">
        <div className="xAuthGrid">
          <div className="xAuthLeft">
            <img className="xAuthBigLogo" src={logo} alt="X" />
          </div>

          <div className="xAuthRight">
            <div className="xAuthH1">{t("auth.happeningNow")}</div>
            <div className="xAuthH2">{t("auth.joinToday")}</div>

            <button
              className="xAuthPrimaryBtn"
              type="button"
              onClick={() => {
                setTab("signup");
                setOpen(true);
              }}
            >
              {t("auth.createAccount")}
            </button>

            <div className="xAuthSubTitle">{t("auth.alreadyHave")}</div>
            <button
              className="xAuthOutlineBtn"
              type="button"
              onClick={() => {
                setTab("signin");
                setOpen(true);
              }}
            >
              {t("auth.signIn")}
            </button>
          </div>
        </div>
      </div>

      <AuthModal open={open} onClose={() => setOpen(false)} initialTab={tab} onAuth={onAuth} />
    </div>
  );
}
