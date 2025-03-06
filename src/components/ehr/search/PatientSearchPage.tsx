
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PatientSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Patient Search</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Search for Patients</CardTitle>
          <CardDescription>Find patients by name, ID, or other criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
          
          <div className="mt-6 rounded-lg border p-4">
            <div className="text-center text-muted-foreground">
              No patients found. Try adjusting your search criteria.
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Patients</CardTitle>
          <CardDescription>Patients you've recently viewed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4">
            <div className="text-center text-muted-foreground">
              No recent patients to display.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientSearchPage;
