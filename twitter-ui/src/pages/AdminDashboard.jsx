import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api";

function RowButton({ onClick, children, variant = "default", disabled = false }) {
  const style = {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: variant === "danger" ? "rgba(244, 63, 94, 0.12)" : "transparent",
    color: variant === "danger" ? "rgb(244, 63, 94)" : "var(--text)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    fontWeight: 600,
    fontSize: 13,
  };

  return (
    <button type="button" onClick={onClick} style={style} disabled={disabled}>
      {children}
    </button>
  );
}

export default function AdminDashboard() {
  const { isAuthed, openAuth, t } = useOutletContext();

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tweets, setTweets] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingTweets, setLoadingTweets] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  const loadUsers = async () => {
    setError(null);
    setSuccess(null);
    setLoadingUsers(true);

    try {
      const res = await api.get("/user/all");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) setError("Giriş gerekli");
      else if (status === 403) setError("Admin yetkisi gerekli");
      else setError(e?.response?.data?.message || "Bir hata oluştu");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadTweets = async (userId) => {
    setError(null);
    setSuccess(null);
    setLoadingTweets(true);

    try {
      const res = await api.get(`/tweet/findByUserId?userId=${userId}`);
      setTweets(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setTweets([]);
      setError(e?.response?.data?.message || "Bir hata oluştu");
    } finally {
      setLoadingTweets(false);
    }
  };

  const onViewTweets = async (userId) => {
    setSelectedUserId(userId);
    await loadTweets(userId);
  };

  const onDeleteUser = async (userId) => {
    setError(null);
    setSuccess(null);

    const confirmed = window.confirm("Bu kullanıcı ve ilişkili verileri silinecek. Emin misin?");
    if (!confirmed) return;

    try {
      await api.delete(`/user/${userId}`);
      setSuccess("Kullanıcı silindi");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      if (selectedUserId === userId) {
        setSelectedUserId(null);
        setTweets([]);
      }
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409) setError(e?.response?.data?.message || "Conflict");
      else if (status === 403) setError("Admin yetkisi gerekli");
      else setError(e?.response?.data?.message || "Bir hata oluştu");
    }
  };

  useEffect(() => {
    if (!isAuthed) return;
    loadUsers();
  }, [isAuthed]);

  return (
    <div className="xCenterCol">
      <div className="xTopTabs" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Admin Paneli</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {!isAuthed ? (
            <RowButton onClick={openAuth}>Giriş yap</RowButton>
          ) : (
            <RowButton onClick={loadUsers} disabled={loadingUsers}>
              {loadingUsers ? "Yükleniyor..." : "Yenile"}
            </RowButton>
          )}
        </div>
      </div>

      {!isAuthed ? (
        <div className="xCard" style={{ margin: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Devam etmek için giriş yap</div>
          <RowButton onClick={openAuth}>Giriş yap</RowButton>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, padding: 16 }}>
          {error ? (
            <div className="xCard" style={{ borderColor: "rgba(244, 63, 94, 0.35)" }}>
              <div style={{ color: "rgb(244, 63, 94)", fontWeight: 700 }}>{error}</div>
            </div>
          ) : null}

          {success ? (
            <div className="xCard" style={{ borderColor: "rgba(34, 197, 94, 0.35)" }}>
              <div style={{ color: "rgb(34, 197, 94)", fontWeight: 700 }}>{success}</div>
            </div>
          ) : null}

          <div className="xCard" style={{ overflow: "hidden" }}>
            <div style={{ padding: 12, borderBottom: "1px solid var(--border)", fontWeight: 800 }}>
              Kullanıcılar
            </div>

            <div style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--muted)", fontSize: 12 }}>
                    <th style={{ padding: 12 }}>Id</th>
                    <th style={{ padding: 12 }}>Username</th>
                    <th style={{ padding: 12 }}>Email</th>
                    <th style={{ padding: 12 }}>Role</th>
                    <th style={{ padding: 12 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelected = u.id === selectedUserId;
                    return (
                      <tr
                        key={u.id}
                        style={{
                          borderTop: "1px solid var(--border)",
                          background: isSelected ? "rgba(29, 155, 240, 0.08)" : "transparent",
                        }}
                      >
                        <td style={{ padding: 12, fontWeight: 700 }}>{u.id}</td>
                        <td style={{ padding: 12 }}>@{u.username}</td>
                        <td style={{ padding: 12 }}>{u.email}</td>
                        <td style={{ padding: 12 }}>{u.admin ? "ADMIN" : "USER"}</td>
                        <td style={{ padding: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <RowButton onClick={() => onViewTweets(u.id)} disabled={loadingTweets && isSelected}>
                            {loadingTweets && isSelected ? "Yükleniyor..." : "Tweetleri gör"}
                          </RowButton>
                          <RowButton onClick={() => onDeleteUser(u.id)} variant="danger" disabled={u.admin}>
                            Kullanıcıyı sil
                          </RowButton>
                        </td>
                      </tr>
                    );
                  })}

                  {!loadingUsers && users.length === 0 ? (
                    <tr style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: 12, color: "var(--muted)" }} colSpan={5}>
                        Kayıtlı kullanıcı yok
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="xCard" style={{ overflow: "hidden" }}>
            <div style={{ padding: 12, borderBottom: "1px solid var(--border)", fontWeight: 800 }}>
              {selectedUser ? `Tweetler @${selectedUser.username}` : "Tweetler"}
            </div>

            <div style={{ padding: 12 }}>
              {!selectedUser ? (
                <div style={{ color: "var(--muted)" }}>Tweetlerini görmek için kullanıcı seç</div>
              ) : tweets.length === 0 && !loadingTweets ? (
                <div style={{ color: "var(--muted)" }}>Bu kullanıcının tweeti yok</div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {tweets.map((tw) => (
                    <div key={tw.id} style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ fontWeight: 800 }}>#{tw.id}</div>
                        <div style={{ color: "var(--muted)", fontSize: 12 }}>{tw.createdAt}</div>
                      </div>
                      <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{tw.content}</div>
                      <div style={{ marginTop: 10, display: "flex", gap: 12, color: "var(--muted)", fontSize: 12 }}>
                        <span>Like: {tw.likeCount}</span>
                        <span>Retweet: {tw.retweetCount}</span>
                        <span>Yorum: {tw.commentCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
