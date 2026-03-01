import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { login as apiLogin } from "../api/auth";

export default function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginAction, logoutAction } = useAuthStore();

  async function login(email, password) {
    const data = await apiLogin(email, password);
    const userInfo = {
      id: data.user_id,
      email: data.email,
      role: data.role,
      full_name: data.full_name,
    };
    loginAction(data.access_token, userInfo);
    navigate("/dashboard");
  }

  function logout() {
    logoutAction();
    navigate("/login");
  }

  return { user, isAuthenticated, login, logout };
}