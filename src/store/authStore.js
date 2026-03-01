import { create } from 'zustand';

// File #28 - authStore.js  (written in Phase 2; stub included here for Phase 3 imports)
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  loginAction: (token, user) => {
    localStorage.setItem('aeoc_token', token);
    localStorage.setItem('aeoc_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logoutAction: () => {
    localStorage.removeItem('aeoc_token');
    localStorage.removeItem('aeoc_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  initAuth: () => {
    const token = localStorage.getItem('aeoc_token');
    const userRaw = localStorage.getItem('aeoc_user');
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        set({ token, user, isAuthenticated: true });
      } catch {
        /* ignore */
      }
    }
  },
}));
