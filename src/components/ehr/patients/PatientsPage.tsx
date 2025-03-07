
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Plus, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { mockPatients, getMedicalRecordsByPatientId } from '@/data/mockEhrData';
import { Patient } from '@/types/ehr';

const PatientsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useEhrAuth();

  // Filter patients based on search query
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Recently viewed patients (hardcoded for demo)
  const recentPatients = [mockPatients[0], mockPatients[1], mockPatients[2]];

  const handleAddPatient = () => {
    toast({
      title: "Patient Added",
      description: "New patient has been added to your care list.",
    });
    setIsDialogOpen(false);
  };

  const handleViewRecords = (patient: Patient) => {
    navigate(`/medical-records/${patient.id}`);
  };

  const handleScheduleAppointment = (patient: Patient) => {
    setSelectedPatient(patient);
    toast({
      title: "Scheduling System",
      description: `Opening scheduling for ${patient.name}`,
    });
    navigate('/appointments');
  };

  // Get recent activities for display
  const getRecentActivities = () => {
    const activities = [
      {
        id: 'act1',
        patientName: 'Jane Doe',
        patientId: 'p1',
        action: 'Viewed records',
        date: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: 'act2',
        patientName: 'John Smith',
        patientId: 'p2',
        action: 'Updated prescription',
        date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: 'act3',
        patientName: 'Maria Garcia',
        patientId: 'p3',
        action: 'Scheduled appointment',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];
    return activities;
  };

  const recentActivities = getRecentActivities();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Patients</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Enter the patient's details to add them to your care list.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Name</label>
                <Input className="col-span-3" placeholder="Patient name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Email</label>
                <Input className="col-span-3" placeholder="patient@example.com" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Date of Birth</label>
                <Input className="col-span-3" type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddPatient}>Add Patient</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients by name, email, or ID..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Patients</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Patients Under Your Care</CardTitle>
                  <CardDescription>Manage your patients and their records</CardDescription>
                </div>
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {filteredPatients.length > 0 ? (
                <div className="space-y-4">
                  {filteredPatients.map(patient => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                          {patient.bloodType && (
                            <Badge variant="outline" className="mt-1">
                              Blood Type: {patient.bloodType}
                            </Badge>
                          )}
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
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleViewRecords(patient)}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Records
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground border rounded-lg">
                  No patients found matching your search criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recently Viewed Patients</CardTitle>
              <CardDescription>Patients you've recently interacted with</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
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
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleViewRecords(patient)}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Records
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground border rounded-lg">
                  No recently viewed patients.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your recent interactions with patients</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="mt-0.5">
                    {activity.action.includes('Viewed') && <FileText className="h-4 w-4 text-blue-500" />}
                    {activity.action.includes('Updated') && <FileText className="h-4 w-4 text-green-500" />}
                    {activity.action.includes('Scheduled') && <Calendar className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{activity.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground border rounded-lg">
              No recent activities to display.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsPage;
