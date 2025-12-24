import { useAppSettings } from "../context/AppSettingsContext.jsx";

export default function SettingsToggles() {
  const { lang, setLang, theme, setTheme } = useAppSettings();

  const toggleLang = () => setLang(lang === "tr" ? "en" : "tr");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="xSettingsRow">
      <button className="xPillBtn" type="button" onClick={toggleLang} aria-label="Toggle language">
        {lang.toUpperCase()}
      </button>

      <button className="xPillBtn" type="button" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? "☀︎" : "☾"}
      </button>
    </div>
  );
}
