import { useEffect, useState } from "react";
import Layout from "./Layout.jsx";
import Loading from "./Loading.jsx";
import Notice from "./Notice.jsx";
import PasswordForm from "./PasswordForm.jsx";
import SchoolLoginLink from "./SchoolLoginLink.jsx";
import TokenProblem from "./TokenProblem.jsx";
import useSecureToken from "../hooks/useSecureToken.js";
import useTokenCheck from "../hooks/useTokenCheck.js";
import usePageTitle from "../hooks/usePageTitle.js";

const COPY = {
  activate: {
    title: "Activate your account",
    intro: "You are setting up your account for the first time. Choose a password to finish.",
    submit: "Activate account",
    working: "Activating...",
    doneTitle: "Your account is active",
    done: "Your account is ready. You can now sign in with your new password.",
    loginLabel: "Go to the school login page",
    checking: "Checking your activation link...",
  },
  reset: {
    title: "Reset your password",
    intro: "Choose a new password for your account.",
    submit: "Reset password",
    working: "Saving...",
    doneTitle: "Your password has been changed",
    done: "Your password was changed. You can now sign in with your new password.",
    loginLabel: "Go to the school login page",
    checking: "Checking your reset link...",
  },
};

// Shared page logic for activation and password reset:
// read the token, ask the backend if it is valid, show the form only if it is,
// submit, then show success with a link to the school login page.
export default function PasswordFlow({ purpose, check, complete }) {
  const copy = COPY[purpose];
  usePageTitle(copy.title);
  const { token, stripFromUrl } = useSecureToken();
  const state = useTokenCheck(token, check);
  const [done, setDone] = useState(false);
  const [problem, setProblem] = useState(null);

  const submit = async (password, confirmPassword) => {
    await complete(token, password, confirmPassword);
    stripFromUrl(); // the token has been used: remove it from the address bar and history
    setDone(true);
  };

  const failure = problem || (state.status === "invalid" ? state.failure : null);
  // A link that can never work is removed from the address bar and history.
  const permanent = ["token_invalid", "token_expired", "token_used"].includes(failure);
  useEffect(() => { if (permanent) stripFromUrl(); }, [permanent, stripFromUrl]);

  return (
    <Layout>
      <h1>{done ? copy.doneTitle : copy.title}</h1>
      {done ? (
        <>
          <Notice tone="success"><p>{copy.done}</p></Notice>
          <SchoolLoginLink>{copy.loginLabel}</SchoolLoginLink>
        </>
      ) : failure ? (
        <TokenProblem failure={failure} purpose={purpose} missing={state.missing && !problem} onRetry={problem ? undefined : state.retry} />
      ) : state.status === "checking" ? (
        <Loading>{copy.checking}</Loading>
      ) : (
        <>
          <p>
            {state.info?.name ? <>Hello, <strong>{state.info.name}</strong>. </> : null}
            {copy.intro}
          </p>
          {state.info?.role === "student" && purpose === "activate" && <p className="muted">Your username is your student ID.</p>}
          <PasswordForm submitLabel={copy.submit} workingLabel={copy.working} onSubmit={submit} onTokenFailure={setProblem} />
        </>
      )}
    </Layout>
  );
}

