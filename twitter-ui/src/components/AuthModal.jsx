import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiX } from "react-icons/fi";
import api from "../api";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import xDark from "../assets/twitter-dark.png";
import xLight from "../assets/twitter-light.png";

function FloatField({ label, type = "text", value, onChange, autoComplete, required }) {
  const [focused, setFocused] = useState(false);
  const filled = Boolean(String(value || "").length);

  return (
    <div className={`xFloatField ${focused ? "isFocused" : ""} ${filled ? "isFilled" : ""}`}>
      <div className="xFloatLabel">{label}</div>
      <input
        className="xFloatInput"
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

export default function AuthModal({ open, onClose, initialTab = "signin", onAuth }) {
  const { t, theme } = useAppSettings();

  const [mode, setMode] = useState(initialTab);

  const [signinUsernameOrEmail, setSigninUsernameOrEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const logo = theme === "dark" ? xDark : xLight;

  const title = useMemo(() => {
    if (mode === "signup") return t("auth.createAccount");
    return t("auth.signIn");
  }, [mode, t]);

  useEffect(() => {
    if (open) setMode(initialTab);
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) {
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const close = () => {
    setError("");
    onClose?.();
  };

  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        usernameOrEmail: signinUsernameOrEmail?.trim(),
        password: signinPassword,
      };

      const res = await api.post("/login", payload);
      const token = res?.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", String(res?.data?.userId ?? ""));
        localStorage.setItem("username", res?.data?.username || payload.usernameOrEmail);
      }

      onAuth?.(res?.data);
      close();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Network error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        username: signupUsername?.trim(),
        email: signupEmail?.trim(),
        password: signupPassword,
      };

      if (signupName?.trim()) localStorage.setItem("displayName", signupName.trim());

      const res = await api.post("/register", payload);
      const token = res?.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", String(res?.data?.userId ?? ""));
        localStorage.setItem("username", payload.username);
      }

      onAuth?.(res?.data);
      close();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors) ? err.response.data.errors.join(", ") : "") ||
        err?.response?.data?.error ||
        err?.message ||
        "Bad Request";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="xModalOverlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target.classList.contains("xModalOverlay")) close();
      }}
    >
      <div className="xModal">
        <div className="xModalTop">
          <button className="xModalClose" type="button" onClick={close} aria-label="Back">
            <FiArrowLeft size={18} />
          </button>
          <img className="xModalLogo" src={logo} alt="X" />
          <button className="xModalClose" type="button" onClick={close} aria-label="Close">
            <FiX size={18} />
          </button>
        </div>

        <div className="xModalTitle">{title}</div>

        {mode === "signin" ? (
          <form className="xModalForm" onSubmit={handleSigninSubmit}>
            <FloatField
              label={t("auth.usernameOrEmail")}
              value={signinUsernameOrEmail}
              onChange={(e) => setSigninUsernameOrEmail(e.target.value)}
              autoComplete="username"
              required
            />
            <FloatField
              label={t("auth.password")}
              type="password"
              value={signinPassword}
              onChange={(e) => setSigninPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error ? <div className="xModalError">{error}</div> : null}

            <button className="xModalPrimary" type="submit" disabled={loading}>
              {loading ? t("auth.signingIn") : t("auth.signIn")}
            </button>

            <div className="xModalBottomRow">
              <div className="xMuted">{t("auth.dontHave")}</div>
              <button
                type="button"
                className="xInlineLink"
                onClick={() => {
                  setError("");
                  setMode("signup");
                }}
              >
                {t("auth.signUp")}
              </button>
            </div>
          </form>
        ) : (
          <form className="xModalForm" onSubmit={handleSignupSubmit}>
            <FloatField label={t("auth.name")} value={signupName} onChange={(e) => setSignupName(e.target.value)} />
            <FloatField
              label={t("auth.username")}
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <FloatField
              label={t("auth.email")}
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <FloatField
              label={t("auth.password")}
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              autoComplete="new-password"
              required
            />

            {error ? <div className="xModalError">{error}</div> : null}

            <button className="xModalPrimary" type="submit" disabled={loading}>
              {loading ? t("auth.creating") : t("auth.createAccount")}
            </button>

            <div className="xModalBottomRow">
              <div className="xMuted">{t("auth.alreadyHave")}</div>
              <button
                type="button"
                className="xInlineLink"
                onClick={() => {
                  setError("");
                  setMode("signin");
                }}
              >
                {t("auth.signIn")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
