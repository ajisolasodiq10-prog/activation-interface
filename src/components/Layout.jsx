import { SCHOOL_NAME } from "../config/env.js";

// Page frame: plain text header, one centred card, short footer.
export default function Layout({ children }) {
  return (
    <div className="page">
      <header className="site-header">
        <p className="site-title">{SCHOOL_NAME || "School Account Setup"}</p>
        {SCHOOL_NAME && <p className="site-subtitle">Account setup</p>}
      </header>
      <main className="card" id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <p>Never share your password or this link with anyone.</p>
      </footer>
    </div>
  );
}
