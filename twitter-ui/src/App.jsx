import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import Layout from "./layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import BookmarksPage from "./pages/BookmarksPage.jsx";
import CommunitiesPage from "./pages/CommunitiesPage.jsx";
import PremiumPage from "./pages/PremiumPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import MorePage from "./pages/MorePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function getStoredUser() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  if (!token) return null;
  return {
    token,
    userId: userId ? Number(userId) : null,
    username: username || "user",
  };
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const isAuthed = useMemo(() => Boolean(user?.token || localStorage.getItem("token")), [user]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage user={user} setUser={setUser} />} />

      <Route element={<Layout user={user} setUser={setUser} />}>
        <Route index element={<HomePage />} />

        <Route path="/explore" element={<ExplorePage isAuthed={isAuthed} />} />
        <Route path="/notifications" element={<NotificationsPage isAuthed={isAuthed} />} />
        <Route path="/messages" element={<MessagesPage isAuthed={isAuthed} />} />
        <Route path="/bookmarks" element={<BookmarksPage isAuthed={isAuthed} />} />
        <Route path="/communities" element={<CommunitiesPage isAuthed={isAuthed} />} />
        <Route path="/premium" element={<PremiumPage isAuthed={isAuthed} />} />
        <Route path="/profile" element={<ProfilePage isAuthed={isAuthed} />} />
        <Route path="/more" element={<MorePage isAuthed={isAuthed} setUser={setUser} />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
