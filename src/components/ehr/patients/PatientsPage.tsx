
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PatientsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Patients</h1>
        <div className="flex items-center gap-2">
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Add New Patient
          </button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Patients</CardTitle>
              <CardDescription>Patients under your care</CardDescription>
            </div>
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <div className="p-4 text-center text-muted-foreground">
              No patients added. Add patients to manage their care.
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Recent interactions with patients</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <div className="p-4 text-center text-muted-foreground">
              No recent activities to display.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsPage;
