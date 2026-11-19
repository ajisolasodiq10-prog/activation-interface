import { schoolLoginHref } from "../config/env.js";

// Link to the School Management Frontend's login page (VITE_SCHOOL_LOGIN_URL).
// This app has no login of its own.
export default function SchoolLoginLink({ children = "Go to the school login page" }) {
  if (!schoolLoginHref) {
    return <p>You can now return to your school&apos;s login page and sign in.</p>;
  }
  return (
    <p>
      <a className="btn btn-primary" href={schoolLoginHref} rel="noopener noreferrer">
        {children}
      </a>
    </p>
  );
}
