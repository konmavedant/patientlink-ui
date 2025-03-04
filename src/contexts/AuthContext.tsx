
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContextType, Patient, Provider } from '../types';
import { patients, providers, users } from '../data/mockData';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps app and makes auth object available
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Patient | Provider | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if there's a user stored in local storage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.type === 'patient') {
          setCurrentUser(patients.find(p => p.id === user.id) || null);
        } else if (user.type === 'provider') {
          setCurrentUser(providers.find(p => p.id === user.id) || null);
        }
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Find user by username
      const user = users.find(u => u.username === username);
      
      if (!user) {
        setError('User not found');
        toast.error('User not found');
        setIsLoading(false);
        return false;
      }
      
      if (user.password !== password) {
        setError('Incorrect password');
        toast.error('Incorrect password');
        setIsLoading(false);
        return false;
      }
      
      // Get full user details based on type
      let fullUser = null;
      if (user.type === 'patient') {
        fullUser = patients.find(p => p.id === user.id) || null;
      } else if (user.type === 'provider') {
        fullUser = providers.find(p => p.id === user.id) || null;
      }
      
      if (!fullUser) {
        setError('User details not found');
        toast.error('User details not found');
        setIsLoading(false);
        return false;
      }
      
      // Set the current user and store in localStorage
      setCurrentUser(fullUser);
      localStorage.setItem('currentUser', JSON.stringify({ id: user.id, type: user.type }));
      toast.success(`Welcome back, ${fullUser.name}`);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Login error', e);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.info('You have been logged out');
    navigate('/login');
  };

  const value = {
    currentUser,
    login,
    logout,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
