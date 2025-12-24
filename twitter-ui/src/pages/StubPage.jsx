import { useAppSettings } from "../context/AppSettingsContext.jsx";

export default function StubPage({ pageKey }) {
  const { t } = useAppSettings();

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontWeight: 900, fontSize: 22 }}>{t(pageKey)}</div>
      <div style={{ marginTop: 8, color: "var(--muted)", fontWeight: 700 }}>
      </div>
    </div>
  );
}
