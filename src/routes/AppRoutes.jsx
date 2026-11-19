import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home.jsx";
import ActivateAccount from "../pages/ActivateAccount.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/activate" element={<ActivateAccount />} />
      <Route path="/setup-password" element={<ActivateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
