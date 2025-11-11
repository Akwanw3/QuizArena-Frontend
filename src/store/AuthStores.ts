import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserStats } from '../types/Index';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user:User|null)=>void;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateUserStats: (stats: Partial<UserStats>)=>void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },
      setUser:(user: any)=>{
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          set({user, isAuthenticated:true});
        }else{
          localStorage.removeItem('user');
          set({user:null, isAuthenticated:false});
        }
      },

      updateUserStats:(stats)=>
        set((state)=>({
          user: state.user?{...state.user, stats:{
            ...state.user.stats, ...stats,
          },
        } : null,
        })),
      

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);