
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from './Navigation';
import ProfileDropdown from './ProfileDropdown';
import { Bell, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getUserNotifications } from '../../data/mockData';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Protect the layout - redirect to login if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  if (!currentUser) return null;
  
  // Get user notifications
  const notifications = getUserNotifications(currentUser.id);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="flex h-full bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center px-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-medical flex items-center justify-center">
                <span className="text-white font-bold">HC</span>
              </div>
              <span className="text-lg font-semibold">HealthChain</span>
            </div>
            <button 
              className="ml-auto rounded-md p-1 hover:bg-neutral-100 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <Navigation userType={currentUser.type} />
          </div>
          
          {/* User info */}
          <div className="border-t p-4">
            <ProfileDropdown />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <button 
              className="rounded-md p-1 hover:bg-neutral-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="ml-auto flex items-center space-x-4">
              <button className="relative rounded-full p-1 hover:bg-neutral-100">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-medical">
                    {unreadCount}
                  </Badge>
                )}
              </button>
              <div className="lg:hidden">
                <ProfileDropdown compact />
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
