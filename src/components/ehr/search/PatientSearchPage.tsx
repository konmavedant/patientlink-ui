
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Calendar, FileText, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mockPatients } from '@/data/mockEhrData';
import { Patient } from '@/types/ehr';

const PatientSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Recent patients (hardcoded for demo)
  const recentPatients = [mockPatients[0], mockPatients[1], mockPatients[2]];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }
    
    // Filter patients based on search query
    const results = mockPatients.filter(patient => 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.insuranceProvider && patient.insuranceProvider.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setSearchResults(results);
    setHasSearched(true);
    
    if (results.length === 0) {
      toast({
        title: "No Results",
        description: "No patients found matching your search criteria",
      });
    } else {
      toast({
        title: "Search Complete",
        description: `Found ${results.length} patient${results.length === 1 ? '' : 's'} matching "${searchQuery}"`,
      });
    }
  };
  
  const handleViewPatient = (patient: Patient) => {
    navigate(`/medical-records/${patient.id}`);
  };

  const handleAddPatient = (patient: Patient) => {
    toast({
      title: "Patient Added",
      description: `${patient.name} has been added to your patient list`,
    });
  };

  const handleScheduleAppointment = (patient: Patient) => {
    toast({
      title: "Schedule Appointment",
      description: `Opening scheduler for ${patient.name}`,
    });
    navigate('/appointments');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Patient Search</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Search for Patients</CardTitle>
          <CardDescription>Find patients by name, ID, email, or insurance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
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
          </form>
          
          {hasSearched && (
            <div className="mt-6">
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map(patient => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                          <div className="flex gap-2 mt-1">
                            {patient.bloodType && (
                              <Badge variant="outline">
                                Blood: {patient.bloodType}
                              </Badge>
                            )}
                            {patient.insuranceProvider && (
                              <Badge variant="secondary">
                                {patient.insuranceProvider}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleScheduleAppointment(patient)}
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          Schedule
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleAddPatient(patient)}
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          Add
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleViewPatient(patient)}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border p-4 text-center text-muted-foreground">
                  No patients found matching your search criteria. Try adjusting your search.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Patients</TabsTrigger>
          <TabsTrigger value="all">All Patients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recently Viewed Patients</CardTitle>
              <CardDescription>Patients you've recently viewed</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPatients.length > 0 ? (
                <div className="space-y-4">
                  {recentPatients.map(patient => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">Last viewed: Today</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewPatient(patient)}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border p-4 text-center text-muted-foreground">
                  No recent patients to display.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Patients</CardTitle>
              <CardDescription>Complete list of patients in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {mockPatients.map(patient => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleViewPatient(patient)}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-center border-t pt-3">
              <p className="text-sm text-muted-foreground">
                Showing {mockPatients.length} patients
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientSearchPage;
