
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/ehr';
import { mockPatients, mockProviders } from '@/data/mockEhrData';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PASSWORDS = {
  'jane.doe@example.com': 'patient123',
  'john.smith@example.com': 'patient123',
  'maria.g@example.com': 'patient123',
  'robert.j@example.com': 'patient123',
  'sarah.w@example.com': 'patient123',
  'dr.chen@hospital.com': 'doctor123',
  'dr.wilson@hospital.com': 'doctor123',
  'dr.brown@clinic.com': 'doctor123',
};

export const EhrAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved session on mount
    const savedUser = localStorage.getItem('ehr_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ehr_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock data
      const allUsers = [...mockPatients, ...mockProviders];
      const foundUser = allUsers.find(u => u.email === email);

      if (!foundUser) {
        throw new Error('User not found');
      }

      // Check password (in a real app, this would be done on the server)
      const correctPassword = DEMO_PASSWORDS[email as keyof typeof DEMO_PASSWORDS];
      if (password !== correctPassword) {
        throw new Error('Invalid password');
      }

      // Login successful
      setUser(foundUser);
      localStorage.setItem('ehr_user', JSON.stringify(foundUser));
      console.log('Login successful for', foundUser.name);
      return foundUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ehr_user');
    setUser(null);
  };

  const authContext = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useEhrAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useEhrAuth must be used within an EhrAuthProvider');
  }
  return context;
};
