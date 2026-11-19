import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { schoolLoginHref } from "../config/env.js";

// Visitors normally arrive through an emailed or shared link. This page only explains that.
export default function Home() {
  usePageTitle("Account setup");
  return (
    <Layout>
      <h1>Account setup</h1>
      <p>Use this site to activate your school account or to choose a new password.</p>
      <ul className="plain-list">
        <li><strong>New account:</strong> open the activation link you were sent (teachers by email, students from the school administrator).</li>
        <li><strong>Teachers who forgot their password:</strong> <Link to="/forgot-password">request a reset link</Link>.</li>
        <li><strong>Students who forgot their password:</strong> contact your school administrator.</li>
      </ul>
      {schoolLoginHref && <p><a href={schoolLoginHref} rel="noopener noreferrer">Go to the school login page</a></p>}
    </Layout>
  );
}
