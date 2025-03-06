
import React from 'react';
import { Shield, Lock, KeyRound, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SecurityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Security</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>Your account security overview</CardDescription>
            </div>
            <Shield className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-8 w-8 rounded-full bg-warning-light flex items-center justify-center">
                <Shield className="h-4 w-4 text-warning-DEFAULT" />
              </div>
              <div>
                <h3 className="font-semibold">Security Strength: Medium</h3>
                <p className="text-sm text-muted-foreground">Enable 2FA to enhance security</p>
              </div>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success-DEFAULT"></div>
                <span className="text-sm">Strong password set</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-error-DEFAULT"></div>
                <span className="text-sm">Two-factor authentication not enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success-DEFAULT"></div>
                <span className="text-sm">Email verified</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </div>
            <KeyRound className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Smartphone className="h-10 w-10 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Authenticator App</h3>
                <p className="text-sm text-muted-foreground">Use an authenticator app to get verification codes</p>
              </div>
            </div>
            <Button variant="outline">Set Up</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>Recent account access</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <div className="p-4 text-center text-muted-foreground">
              No recent login activity to display.
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Device Management</CardTitle>
          <CardDescription>Manage devices that can access your account</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Current Device</h3>
                  <p className="text-sm text-muted-foreground">This device • Last active now</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Sign Out</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;
