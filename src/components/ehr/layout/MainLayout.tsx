
import React, { useState, useEffect } from 'react';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface MainLayoutProps {
  requiredRole?: 'patient' | 'provider' | undefined;
}

const MainLayout: React.FC<MainLayoutProps> = ({ requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useEhrAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const location = useLocation();
  
  // Close sidebar by default on mobile devices
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Close sidebar when changing routes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex h-screen bg-background relative">
      <div 
        className={`
          ${sidebarOpen ? 'block' : 'hidden'} 
          ${isMobile ? 'absolute z-50 h-full shadow-lg' : 'relative'} 
          transition-all duration-300 ease-in-out
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          showMenuButton={isMobile}
        />
        <main className={`
          flex-1 overflow-auto p-6 
          pt-20 lg:pt-6
          ${isMobile && sidebarOpen ? 'opacity-50' : 'opacity-100'}
          transition-opacity duration-300
        `}>
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-40" 
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
