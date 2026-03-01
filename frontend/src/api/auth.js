import api from "./axios";

export async function login(email, password) {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
}

export async function register(email, password, fullName) {
  const response = await api.post("/api/auth/register", {
    email,
    password,
    full_name: fullName,
  });
  return response.data;
}