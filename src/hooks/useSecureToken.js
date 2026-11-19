import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

// Reads the "token" from the page address once, keeps it in memory only, and
// can remove it from the address bar and browser history.
export default function useSecureToken() {
  const { search } = useLocation();
  const initial = useMemo(() => {
    const value = new URLSearchParams(search).get("token");
    return value && value.length <= 2048 ? value.trim() : "";
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [token] = useState(initial);

  // Replaces the current history entry with the same page without the query string.
  const stripFromUrl = useCallback(() => {
    try { window.history.replaceState(window.history.state, "", window.location.pathname); } catch { /* ignore */ }
  }, []);

  return { token, stripFromUrl };
}
