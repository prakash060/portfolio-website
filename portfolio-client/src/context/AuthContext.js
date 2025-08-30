import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signUp = (userData) => {
    // In a real app, this would make an API call
    const newUser = {
      id: Date.now(),
      email: userData.email,
      name: userData.name
    };
    
    // Store user data (in real app, this would be in a database)
    localStorage.setItem('users', JSON.stringify([
      ...JSON.parse(localStorage.getItem('users') || '[]'),
      newUser
    ]));
    
    return { success: true, message: 'User registered successfully!' };
  };

  const signIn = (credentials) => {
    // In a real app, this would validate against a database
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === credentials.email);
    
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, message: 'Login successful!' };
    } else {
      return { success: false, message: 'Invalid credentials!' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
