import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { fullName: string; email: string; password: string; phone?: string }) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await authApi.getMe();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch {
          // Token không còn hợp lệ — xóa dữ liệu cũ
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await authApi.login({ email, password });
    const { token: newToken, user: newUser } = res.data;
    // Cập nhật localStorage TRƯỚC khi set state để tránh race condition với route guards
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    // Batch state update
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const register = async (data: { fullName: string; email: string; password: string; phone?: string }): Promise<User> => {
    const res = await authApi.register(data);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Kiểm tra dựa trên cả state lẫn localStorage để tránh flash khi navigate ngay sau login
  const effectiveToken = token || localStorage.getItem('token');
  const effectiveUserStr = !user ? localStorage.getItem('user') : null;
  const effectiveUser = user || (effectiveUserStr ? (() => { try { return JSON.parse(effectiveUserStr); } catch { return null; } })() : null);

  const isAuthenticated = !!effectiveToken && !!effectiveUser;
  const isAdmin = isAuthenticated && effectiveUser?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user: effectiveUser,
        token: effectiveToken,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
