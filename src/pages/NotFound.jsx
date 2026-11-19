import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <Layout>
      <h1>Page not found</h1>
      <p>This page does not exist. If you were sent a link, open the full link from your message or email.</p>
      <p><Link to="/">Go to the start page</Link></p>
    </Layout>
  );
}
