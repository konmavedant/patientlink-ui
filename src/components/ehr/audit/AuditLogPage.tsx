
import React from 'react';
import { History, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AuditLogPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>All access and actions on your medical records</CardDescription>
            </div>
            <History className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <div className="p-4 text-center text-muted-foreground">
              No audit logs to display.
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
          <CardDescription>Important security notifications</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-success-light flex items-center justify-center">
                <History className="h-4 w-4 text-success-DEFAULT" />
              </div>
              <div>
                <h3 className="font-medium">No Security Alerts</h3>
                <p className="text-sm text-muted-foreground">Your account is secure</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogPage;
