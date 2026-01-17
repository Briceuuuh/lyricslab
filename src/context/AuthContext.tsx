import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface User {
  email: string;
  created_at?: string;
}

interface DecodedToken {
  email: string;
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  decodedToken: DecodedToken | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Decode JWT token (base64 decode the payload)
function decodeJWT(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    // Base64 decode (handle URL-safe base64)
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.warn('Failed to decode JWT:', error);
    return null;
  }
}

// Check if token is expired
function isTokenExpired(decodedToken: DecodedToken): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [storedToken, setStoredToken] = useLocalStorage<string | null>('lyriclab_token', null);
  const [token, setToken] = useState<string | null>(storedToken);
  const [user, setUser] = useState<User | null>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify token on mount and when token changes
  useEffect(() => {
    const verifyToken = async () => {
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // First, decode and check expiration locally
      const decoded = decodeJWT(storedToken);
      if (!decoded || isTokenExpired(decoded)) {
        // Token expired or invalid, clear it
        setToken(null);
        setStoredToken(null);
        setUser(null);
        setDecodedToken(null);
        setIsLoading(false);
        return;
      }

      // Verify with backend
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: storedToken }),
        });

        const data = await response.json();

        if (data.success) {
          setToken(storedToken);
          setDecodedToken(decoded);
          setUser({ email: data.email });
        } else {
          // Token invalid on server side
          setToken(null);
          setStoredToken(null);
          setUser(null);
          setDecodedToken(null);
        }
      } catch (error) {
        console.warn('Token verification failed:', error);
        // On network error, trust local decode if not expired
        setToken(storedToken);
        setDecodedToken(decoded);
        setUser({ email: decoded.email });
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [storedToken]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        const decoded = decodeJWT(data.token);
        setToken(data.token);
        setStoredToken(data.token);
        setDecodedToken(decoded);
        setUser({ email: data.user.email, created_at: data.user.created_at });
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Connection error. Please check your connection.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        const decoded = decodeJWT(data.token);
        setToken(data.token);
        setStoredToken(data.token);
        setDecodedToken(decoded);
        setUser({ email: data.user.email, created_at: data.user.created_at });
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Connection error. Please check your connection.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setStoredToken(null);
    setUser(null);
    setDecodedToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        decodedToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
