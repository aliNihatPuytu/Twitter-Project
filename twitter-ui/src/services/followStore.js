const KEY = "x_followed_handles";

export function getFollowed() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function isFollowed(handle) {
  const h = String(handle || "").toLowerCase();
  return getFollowed().includes(h);
}

export function toggleFollow(handle) {
  const h = String(handle || "").toLowerCase();
  const cur = getFollowed();
  const next = cur.includes(h) ? cur.filter((x) => x !== h) : [...cur, h];

  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("x:follow-changed", { detail: next }));
  return next;
}

export function onFollowChanged(cb) {
  const fn = (e) => cb?.(e?.detail ?? getFollowed());
  window.addEventListener("x:follow-changed", fn);
  return () => window.removeEventListener("x:follow-changed", fn);
}
