
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  Lock,
  BarChart,
  Settings,
  AlertCircle,
  Calendar,
  Upload,
  Search,
  History,
  Shield,
  Menu,
  X,
} from 'lucide-react';

// Add the interface to define the prop types
interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user } = useEhrAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!user) return null;

  const isPatient = user.role === 'patient';
  const isProvider = user.role === 'provider';

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded && onClose) {
      onClose();
    }
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: isPatient ? '/patient-dashboard' : '/provider-dashboard',
      roles: ['patient', 'provider'],
    },
    {
      title: 'Medical Records',
      icon: <FileText className="w-5 h-5" />,
      href: '/medical-records',
      roles: ['patient', 'provider'],
    },
    {
      title: 'Appointments',
      icon: <Calendar className="w-5 h-5" />,
      href: '/appointments',
      roles: ['patient', 'provider'],
    },
    {
      title: 'Patient Search',
      icon: <Search className="w-5 h-5" />,
      href: '/patient-search',
      roles: ['provider'],
    },
    {
      title: 'My Providers',
      icon: <Users className="w-5 h-5" />,
      href: '/providers',
      roles: ['patient'],
    },
    {
      title: 'My Patients',
      icon: <Users className="w-5 h-5" />,
      href: '/patients',
      roles: ['provider'],
    },
    {
      title: 'Access Management',
      icon: <Lock className="w-5 h-5" />,
      href: '/access',
      roles: ['patient', 'provider'],
    },
    {
      title: 'Upload Data',
      icon: <Upload className="w-5 h-5" />,
      href: '/upload',
      roles: ['patient'],
    },
    {
      title: 'Audit Log',
      icon: <History className="w-5 h-5" />,
      href: '/audit',
      roles: ['patient', 'provider'],
    },
    {
      title: 'Analytics',
      icon: <BarChart className="w-5 h-5" />,
      href: '/analytics',
      roles: ['provider'],
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/settings',
      roles: ['patient', 'provider'],
    },
    {
      title: 'Security',
      icon: <Shield className="w-5 h-5" />,
      href: '/security',
      roles: ['patient', 'provider'],
    },
    {
      title: 'Help & Support',
      icon: <AlertCircle className="w-5 h-5" />,
      href: '/support',
      roles: ['patient', 'provider'],
    },
  ];

  const filteredNavigation = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile toggle button for responsive mode */}
      <button 
        onClick={toggleSidebar} 
        className="fixed lg:hidden z-50 top-4 left-4 bg-primary text-white p-2 rounded-md"
      >
        {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      
      {/* Mobile overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/30 lg:hidden z-40"
          onClick={() => {
            setIsExpanded(false);
            if (onClose) onClose();
          }}
        />
      )}

      <aside className={cn(
        "lg:flex flex-col border-r bg-card z-50 fixed lg:static h-full transition-all duration-300",
        isExpanded ? "flex w-64" : "hidden lg:flex lg:w-64"
      )}>
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center">
            <div className="mr-2 rounded-md h-8 w-8 bg-primary"></div>
            <span className="text-xl font-semibold">
              HealthChain
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm">
            {filteredNavigation.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground'
                  )
                }
                onClick={() => {
                  setIsExpanded(false);
                  if (onClose) onClose();
                }}
              >
                {item.icon}
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-muted-foreground">
            <div className="flex flex-col space-y-1">
              <span className="text-xs font-medium leading-none text-muted-foreground">
                {isPatient ? 'Patient Portal' : 'Provider Portal'}
              </span>
              <span className="text-sm font-medium leading-none text-foreground">
                {user.name}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
