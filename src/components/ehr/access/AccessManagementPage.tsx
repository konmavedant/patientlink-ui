
import React from 'react';
import { Lock, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AccessManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Access Management</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permission Settings</CardTitle>
              <CardDescription>Control who can access your health data</CardDescription>
            </div>
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Default Privacy Settings</h3>
                <p className="text-sm text-muted-foreground">Your data is private by default</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-warning-DEFAULT" />
              <div>
                <h3 className="font-semibold">No Active Permissions</h3>
                <p className="text-sm text-muted-foreground">You haven't granted access to any providers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Access Requests</CardTitle>
          <CardDescription>Pending permission requests</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <div className="p-4 text-center text-muted-foreground">
              No pending access requests.
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Access History</CardTitle>
          <CardDescription>Who has accessed your records</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <div className="p-4 text-center text-muted-foreground">
              No access history to display.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessManagementPage;
