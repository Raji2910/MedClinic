import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuth = create()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (email, password) => {
        // Hardcoded credentials
        if (email === 'staff@clinic.com' && password === '123456') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);