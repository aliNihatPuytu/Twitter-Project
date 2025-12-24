import { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiBell,
  FiMail,
  FiBookmark,
  FiUsers,
  FiStar,
  FiUser,
  FiMoreHorizontal,
} from "react-icons/fi";
import RightRail from "../ui/RightRail.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { useAppSettings } from "../context/AppSettingsContext.jsx";
import xDark from "../assets/twitter-dark.png";
import xLight from "../assets/twitter-light.png";

function navCls(isActive) {
  return `xNavItem${isActive ? " isActive" : ""}`;
}

export default function Layout({ user, setUser }) {
  const { t, theme } = useAppSettings();
  const navigate = useNavigate();

  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("signin");

  const isAuthed = Boolean(user?.token || localStorage.getItem("token"));
  const logo = theme === "dark" ? xDark : xLight;

  const openAuth = (tab = "signin") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const closeAuth = () => setAuthOpen(false);

  const onAuth = (payload) => {
    const token = payload?.token || localStorage.getItem("token") || "";
    const storedId = Number(localStorage.getItem("userId") || "0");
    const userId = payload?.userId ?? (storedId || null);
    const username = payload?.username || localStorage.getItem("username") || "user";

    setUser?.(token ? { token, userId, username } : null);
    closeAuth();
  };

  const meName = useMemo(() => {
    if (isAuthed) return user?.username || localStorage.getItem("username") || "user";
    return t("common.guest");
  }, [isAuthed, user, t]);

  const meHandle = useMemo(() => {
    if (isAuthed) return `@${user?.username || localStorage.getItem("username") || "user"}`;
    return "@guest";
  }, [isAuthed, user]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser?.(null);
    navigate("/");
  };

  const guardNav = (to) => {
    if (!isAuthed) {
      openAuth("signin");
      return;
    }
    navigate(to);
  };

  return (
    <div className="xRoot">
      <div className="xLayout">
        <aside className="xLeft">
          <div className="xLeftInner">
            <button className="xBrandBtn" type="button" onClick={() => navigate("/")}>
              <img className="xBrandLogo" src={logo} alt="X" />
            </button>

            <nav className="xNav">
              <NavLink className={({ isActive }) => navCls(isActive)} to="/">
                <span className="xNavIcon">
                  <FiHome size={22} />
                </span>
                <span className="xNavText">{t("nav.home")}</span>
              </NavLink>

              <button className="xNavItem" type="button" onClick={() => guardNav("/explore")}>
                <span className="xNavIcon">
                  <FiSearch size={22} />
                </span>
                <span className="xNavText">{t("nav.explore")}</span>
              </button>

              <button className="xNavItem" type="button" onClick={() => guardNav("/notifications")}>
                <span className="xNavIcon">
                  <FiBell size={22} />
                </span>
                <span className="xNavText">{t("nav.notifications")}</span>
              </button>

              <button className="xNavItem" type="button" onClick={() => guardNav("/messages")}>
                <span className="xNavIcon">
                  <FiMail size={22} />
                </span>
                <span className="xNavText">{t("nav.messages")}</span>
              </button>

              <button className="xNavItem" type="button" onClick={() => guardNav("/bookmarks")}>
                <span className="xNavIcon">
                  <FiBookmark size={22} />
                </span>
                <span className="xNavText">{t("nav.bookmarks")}</span>
              </button>

              <button className="xNavItem" type="button" onClick={() => guardNav("/communities")}>
                <span className="xNavIcon">
                  <FiUsers size={22} />
                </span>
                <span className="xNavText">{t("nav.communities")}</span>
              </button>

              <button className="xNavItem" type="button" onClick={() => guardNav("/premium")}>
                <span className="xNavIcon">
                  <FiStar size={22} />
                </span>
                <span className="xNavText">{t("nav.premium")}</span>
              </button>

              <button className="xNavItem" type="button" onClick={() => guardNav("/profile")}>
                <span className="xNavIcon">
                  <FiUser size={22} />
                </span>
                <span className="xNavText">{t("nav.profile")}</span>
              </button>

              <button className="xNavItem" type="button" onClick={() => guardNav("/more")}>
                <span className="xNavIcon">
                  <FiMoreHorizontal size={22} />
                </span>
                <span className="xNavText">{t("nav.more")}</span>
              </button>
            </nav>

            <button
              className="xPostBtn"
              type="button"
              onClick={() => {
                if (!isAuthed) return openAuth("signin");
                window.dispatchEvent(new CustomEvent("x:compose"));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {t("common.post")}
            </button>

            <div className="xLeftBottom">
              <button
                className="xProfileBtn"
                type="button"
                onClick={() => {
                  if (!isAuthed) openAuth("signin");
                  else navigate("/profile");
                }}
              >
                <div className="xAvatar" aria-hidden="true" />
                <div className="xProfileMeta">
                  <div className="xProfileName">{meName}</div>
                  <div className="xProfileHandle">{meHandle}</div>
                </div>
                <div className="xProfileDots">⋯</div>
              </button>

              {isAuthed ? (
                <button className="xNavItem" type="button" onClick={logout}>
                  <span className="xNavIcon">⎋</span>
                  <span className="xNavText">{t("common.logout")}</span>
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        <main className="xCenter">
          <Outlet context={{ isAuthed, user, openAuth }} />
        </main>

        <aside className="xRight">
          <RightRail />
        </aside>
      </div>

      <AuthModal open={authOpen} onClose={closeAuth} initialTab={authTab} onAuth={onAuth} />
    </div>
  );
}
