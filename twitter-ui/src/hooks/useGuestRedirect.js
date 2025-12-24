import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useGuestRedirect(isAuthed, ms = 20000) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthed) return;
    const id = setTimeout(() => navigate("/auth"), ms);
    return () => clearTimeout(id);
  }, [isAuthed, ms, navigate]);
}
