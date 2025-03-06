
import React from 'react';
import { Settings, User, Bell, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </div>
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" placeholder="email@example.com" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Address</label>
              <textarea className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" rows={3} placeholder="Your address"></textarea>
            </div>
            
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </div>
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive appointment and record updates via email</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-muted flex items-center p-1">
                <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive appointment reminders via SMS</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-muted flex items-center p-1">
                <div className="h-4 w-4 rounded-full bg-muted-foreground"></div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button>Save Preferences</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Update your password and security options</CardDescription>
            </div>
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Password</label>
              <input type="password" className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" placeholder="••••••••" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">New Password</label>
                <input type="password" className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <input type="password" className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2" placeholder="••••••••" />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button>Update Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
