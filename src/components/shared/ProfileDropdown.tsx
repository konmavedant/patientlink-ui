
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';

interface ProfileDropdownProps {
  compact?: boolean;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ compact = false }) => {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  
  if (!currentUser) return null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar className="h-9 w-9 border border-neutral-200">
            <AvatarImage src={currentUser.profileImage} alt={currentUser.name} />
            <AvatarFallback className="bg-medical-light text-medical-dark">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
          
          {!compact && (
            <div className="text-left">
              <p className="text-sm font-medium text-neutral-700">{currentUser.name}</p>
              <p className="text-xs text-neutral-500 capitalize">{currentUser.type}</p>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 animate-in fade-in-80 zoom-in-95">
        <DropdownMenuLabel>
          <div className="text-sm font-normal">
            <p className="font-medium">{currentUser.name}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{currentUser.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-error cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
