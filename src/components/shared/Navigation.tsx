
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  History,
  Users,
  Settings,
  ChevronRight
} from 'lucide-react';

interface NavigationProps {
  userType: 'patient' | 'provider';
}

const Navigation: React.FC<NavigationProps> = ({ userType }) => {
  const location = useLocation();
  
  // Define navigation items based on user type
  const navItems = userType === 'patient' 
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Records', href: '/records', icon: FileText },
        { name: 'Access Control', href: '/access', icon: ShieldCheck },
        { name: 'Settings', href: '/settings', icon: Settings }
      ]
    : [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Patients', href: '/patients', icon: Users },
        { name: 'Records', href: '/records', icon: FileText },
        { name: 'Audit Log', href: '/audit', icon: History },
        { name: 'Settings', href: '/settings', icon: Settings }
      ];
  
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`group relative flex items-center px-2 py-2.5 text-sm rounded-md transition-all duration-300 ${
              isActive
                ? 'bg-medical-lightest text-medical-dark font-medium'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {isActive && <div className="active-nav-indicator" />}
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                isActive ? 'text-medical' : 'text-neutral-400 group-hover:text-neutral-500'
              }`}
            />
            <span>{item.name}</span>
            <ChevronRight 
              className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                isActive ? 'text-medical rotate-90' : 'text-neutral-300 group-hover:text-neutral-400'
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
