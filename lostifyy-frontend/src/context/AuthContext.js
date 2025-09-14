import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

// Helper function to parse JWT token
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return null;
  }
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          const payload = parseJwt(token);
          if (payload) {
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (payload.exp && payload.exp < currentTime) {
              logout();
              return;
            }
            
            // Set user data
            setUser({
              id: payload.id,
              username: payload.sub, // The subject is the username
              email: payload.email,
              roles: payload.roles || [],
              token
            });
            
            // Set auth header for all future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            // Invalid token format
            logout();
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, [token]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedUniversityId');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    login,
    logout,
    token,
    isAuthenticated: !!user,
    isLoading: loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};