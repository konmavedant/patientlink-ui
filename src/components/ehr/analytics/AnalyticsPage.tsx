
import React from 'react';
import { BarChart, PieChart, LineChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              0 this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records Accessed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              0 today
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>Age and gender distribution</CardDescription>
              </div>
              <PieChart className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-60 rounded-lg border">
              <div className="text-center text-muted-foreground">
                <p>No patient data available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Activity</CardTitle>
                <CardDescription>Patient visits over time</CardDescription>
              </div>
              <LineChart className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-60 rounded-lg border">
              <div className="text-center text-muted-foreground">
                <p>No activity data available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Treatment Outcomes</CardTitle>
              <CardDescription>Efficacy of treatments by condition</CardDescription>
            </div>
            <BarChart className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-60 rounded-lg border">
            <div className="text-center text-muted-foreground">
              <p>No treatment data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
