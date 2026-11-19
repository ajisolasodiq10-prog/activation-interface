import PasswordFlow from "../components/PasswordFlow.jsx";
import { completeActivation, validateActivationToken } from "../services/accountApi.js";

// /activate?token=...  (teachers and students)
// Also used for /setup-password?token=...: the token is checked first, and the
// password form is shown only when the backend says the token is valid.
export default function ActivateAccount() {
  return <PasswordFlow purpose="activate" check={validateActivationToken} complete={completeActivation} />;
}
