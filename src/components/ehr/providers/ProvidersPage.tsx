
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ProvidersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Providers</h1>
        <div className="flex items-center gap-2">
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Add New Provider
          </button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Providers</CardTitle>
              <CardDescription>Healthcare professionals with access to your records</CardDescription>
            </div>
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <div className="p-4 text-center text-muted-foreground">
              No providers added. Add a provider to share your medical records.
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Provider Requests</CardTitle>
          <CardDescription>Pending access requests from healthcare providers</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <div className="p-4 text-center text-muted-foreground">
              No pending provider requests.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProvidersPage;
