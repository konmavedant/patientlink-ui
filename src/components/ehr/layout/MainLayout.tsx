
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

// Add these interfaces to fix the TypeScript errors
interface SidebarProps {
  onClose: () => void;
}

interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
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

  // Close sidebar when changing routes on mobile only, not on desktop
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background relative">
      {/* Sidebar */}
      <div 
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          ${isMobile ? 'fixed z-50 h-full shadow-lg' : 'relative'} 
          transition-all duration-300 ease-in-out
          lg:block
        `}
        style={{ width: '16rem' }}
      >
        <Sidebar onClose={() => isMobile ? setSidebarOpen(false) : null} />
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Header 
          onMenuClick={toggleSidebar}
          showMenuButton={isMobile || !sidebarOpen}
        />
        <main className={`
          flex-1 overflow-auto p-6 
          pt-20 lg:pt-6
          transition-all duration-300
          ${isMobile ? 'w-full' : sidebarOpen ? 'lg:ml-0' : 'lg:ml-0 w-full'}
        `}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
