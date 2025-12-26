import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppSettingsContext = createContext(null);

const dict = {
  tr: {
    nav: {
      home: "Anasayfa",
      explore: "Keşfet",
      notifications: "Bildirimler",
      messages: "Mesajlar",
      bookmarks: "Yer işaretleri",
      communities: "Topluluklar",
      premium: "Premium",
      profile: "Profil",
      more: "Daha fazla",
    },
    common: {
      guest: "Misafir",
      post: "Gönderi yayınla",
      forYou: "Sana özel",
      following: "Takip",
      continueSignIn: "Devam etmek için giriş yap",
      search: "Ara",
      subscribeTitle: "Premium’a abone ol",
      subscribeText: "Yeni özellikleri açmak için abone ol ve uygun olman durumunda içerik üreticisi gelir payı kazan.",
      subscribeBtn: "Abone ol",
      whatsHappening: "Neler oluyor?",
      whoToFollow: "Kimi takip etmeli",
      showMore: "Daha fazla göster",
      logout: "Çıkış yap",
      followBtn: "Takip et",
      unfollowBtn: "Takipten çık",
      home: { empty: "Henüz gönderi yok." },
    },
    auth: {
      happeningNow: "Neler oluyor?",
      joinToday: "Bugün katıl.",
      signIn: "Giriş yap",
      signingIn: "Giriş yapılıyor…",
      signUp: "Kaydol",
      createAccount: "Hesap oluştur",
      creating: "Oluşturuluyor…",
      usernameOrEmail: "Kullanıcı adı veya e-posta",
      password: "Şifre",
      name: "Ad",
      username: "Kullanıcı adı",
      email: "E-posta",
      dontHave: "Hesabın yok mu?",
      alreadyHave: "Zaten bir hesabın var mı?",
    },
    explore: {
      title: "Keşfet",
      people: "Kişiler",
      users: "Kullanıcılar",
      searchPlaceholder: "X’te ara",
      noResults: "Sonuç bulunamadı.",
    },
    notifications: {
      mentions: "Bahsedilenler",
      guestInfo: "Bildirimleri görmek için giriş yap.",
      sample1: "Büşra seni bir gönderide etiketledi.",
      sample2: "Özgür gönderini beğendi.",
    },
    messages: {
      requests: "İstekler",
      guestInfo: "Mesajları görmek için giriş yap.",
      empty: "Henüz mesaj yok.",
    },
    bookmarks: {
      tags: "Etiketler",
      guestInfo: "Yer işaretlerini görmek için giriş yap.",
      empty: "Henüz yer işareti yok.",
    },
    communities: {
      discover: "Keşfet",
      guestInfo: "Topluluklara katılmak için giriş yap.",
      sample: "Topluluk akışı (placeholder).",
    },
    premium: {
      features: "Özellikler",
      copy: "Premium sayfası (placeholder).",
    },
    profile: {
      posts: "Gönderiler",
      guestInfo: "Profili görmek için giriş yap.",
      sampleBio: "Profil bio (placeholder).",
      followers: "Takipçi",
      following: "Takip",
      postsHint: "Kendi gönderilerin burada listelenecek.",
    },
    more: {
      settings: "Ayarlar",
      quickSettings: "Hızlı ayarlar",
    },
  },
  en: {
    nav: {
      home: "Home",
      explore: "Explore",
      notifications: "Notifications",
      messages: "Messages",
      bookmarks: "Bookmarks",
      communities: "Communities",
      premium: "Premium",
      profile: "Profile",
      more: "More",
    },
    common: {
      guest: "Guest",
      post: "Post",
      forYou: "For you",
      following: "Following",
      continueSignIn: "Continue to sign in",
      search: "Search",
      subscribeTitle: "Subscribe to Premium",
      subscribeText: "Subscribe to unlock new features and, if eligible, earn a share of creator revenue.",
      subscribeBtn: "Subscribe",
      whatsHappening: "What’s happening",
      whoToFollow: "Who to follow",
      showMore: "Show more",
      logout: "Log out",
      followBtn: "Follow",
      unfollowBtn: "Following",
      home: { empty: "No posts yet." },
    },
    auth: {
      happeningNow: "What’s happening?",
      joinToday: "Join today.",
      signIn: "Sign in",
      signingIn: "Signing in…",
      signUp: "Sign up",
      createAccount: "Create account",
      creating: "Creating…",
      usernameOrEmail: "Username or email",
      password: "Password",
      name: "Name",
      username: "Username",
      email: "Email",
      dontHave: "Don’t have an account?",
      alreadyHave: "Already have an account?",
    },
    explore: {
      title: "Explore",
      people: "People",
      users: "Users",
      searchPlaceholder: "Search X",
      noResults: "No results.",
    },
    notifications: {
      mentions: "Mentions",
      guestInfo: "Sign in to see your notifications.",
      sample1: "Büşra mentioned you in a post.",
      sample2: "Özgür liked your post.",
    },
    messages: {
      requests: "Requests",
      guestInfo: "Sign in to see your messages.",
      empty: "No messages yet.",
    },
    bookmarks: {
      tags: "Tags",
      guestInfo: "Sign in to see your bookmarks.",
      empty: "No bookmarks yet.",
    },
    communities: {
      discover: "Discover",
      guestInfo: "Sign in to join communities.",
      sample: "Communities feed (placeholder).",
    },
    premium: {
      features: "Features",
      copy: "Premium page (placeholder).",
    },
    profile: {
      posts: "Posts",
      guestInfo: "Sign in to view profiles.",
      sampleBio: "Profile bio (placeholder).",
      followers: "Followers",
      following: "Following",
      postsHint: "Your posts will show here.",
    },
    more: {
      settings: "Settings",
      quickSettings: "Quick settings",
    },
  },
};

export function AppSettingsProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "tr");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const t = useMemo(() => {
    const table = dict[lang] || dict.tr;
    return (key) => {
      // key: "auth.signIn" -> table.auth.signIn
      const parts = String(key).split(".");
      let cur = table;
      for (const p of parts) cur = cur?.[p];
      return cur || key; // bulunamazsa key döner ama artık çoğu var
    };
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, theme, setTheme, t }),
    [lang, theme, t]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return ctx;
}
