import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { getToken, removeToken, setToken } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        const response = await api.get('/users/profile');
        setUser(response.data.data);
      } catch (error) {
        removeToken();
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      console.log('Login attempt:', { email });
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        setToken(token);
        setUser(user);
        return { success: true, user };
      } else {
        return {
          success: false,
          message: response.data.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Login failed';
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || 
                      error.response.data.errors?.[0]?.msg || 
                      'Login failed';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Make sure the backend is running on port 5001.';
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      console.log('Signup attempt:', { name, email, role });
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        role: role || 'STUDENT',
      });
      
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        setToken(token);
        setUser(user);
        return { success: true, user };
      } else {
        return {
          success: false,
          message: response.data.message || 'Signup failed',
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Signup failed';
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || 
                      error.response.data.errors?.[0]?.msg || 
                      error.response.data.error ||
                      'Signup failed';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Make sure the backend is running on port 5001.';
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

