import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
        setIsAuthenticated(true);
      })
      .catch(error => {
        console.error('Failed to fetch user details:', error);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
  }, []);

  const login = (user, token) => {
    setIsAuthenticated(true);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // Store user ID or other user details if needed
  };

  const logout = (navigate) => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/")
  };

  const addFavorite = async (recipeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/favorites/${recipeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(prev => ({ ...prev, favorites: response.data }));
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  };

  const removeFavorite = async (recipeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/favorites/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(prev => ({ ...prev, favorites: response.data }));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, addFavorite, removeFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};
