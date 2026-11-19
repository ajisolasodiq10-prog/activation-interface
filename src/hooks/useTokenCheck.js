import { useEffect, useState } from "react";
import { AccountApiError, FAILURE } from "../services/accountApi.js";

// Asks the backend whether a token is valid. Returns { status, info, failure }.
// status: "checking" | "valid" | "invalid"
export default function useTokenCheck(token, check) {
  const [state, setState] = useState(token ? { status: "checking" } : { status: "invalid", failure: FAILURE.TOKEN_INVALID, missing: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!token) return undefined;
    const controller = new AbortController();
    setState({ status: "checking" });
    check(token, { signal: controller.signal })
      .then((info) => setState({ status: "valid", info }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        const failure = error instanceof AccountApiError ? error.kind : FAILURE.UNKNOWN;
        setState({ status: "invalid", failure });
      });
    return () => controller.abort();
  }, [token, check, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
