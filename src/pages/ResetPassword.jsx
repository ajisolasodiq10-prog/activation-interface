import PasswordFlow from "../components/PasswordFlow.jsx";
import { completeReset, validateResetToken } from "../services/accountApi.js";

// /reset-password?token=...  (teachers and students)
export default function ResetPassword() {
  return <PasswordFlow purpose="reset" check={validateResetToken} complete={completeReset} />;
}
