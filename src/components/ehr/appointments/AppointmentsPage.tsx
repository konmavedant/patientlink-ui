
import React, { useState } from 'react';
import { Calendar, Clock, User, Calendar as CalendarIcon, Plus, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { mockPatients, mockProviders } from '@/data/mockEhrData';

// Sample appointment data
const sampleAppointments = [
  {
    id: 'appt1',
    patientId: 'p1',
    patientName: 'Jane Doe',
    providerId: 'doc1',
    providerName: 'Dr. Elizabeth Chen',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    time: '09:30 AM',
    status: 'scheduled',
    type: 'Follow-up',
    notes: 'Discuss lab results'
  },
  {
    id: 'appt2',
    patientId: 'p2',
    patientName: 'John Smith',
    providerId: 'doc2',
    providerName: 'Dr. James Wilson',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
    time: '11:00 AM',
    status: 'scheduled',
    type: 'Consultation',
    notes: 'Initial neurological assessment'
  },
  {
    id: 'appt3',
    patientId: 'p3',
    patientName: 'Maria Garcia',
    providerId: 'doc3',
    providerName: 'Dr. Olivia Brown',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    time: '10:15 AM',
    status: 'completed',
    type: 'Annual Check-up',
    notes: 'Routine examination'
  },
  {
    id: 'appt4',
    patientId: 'p4',
    patientName: 'Robert Johnson',
    providerId: 'doc4',
    providerName: 'Dr. Michael Rodriguez',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    time: '02:30 PM',
    status: 'completed',
    type: 'Follow-up',
    notes: 'Review knee MRI results'
  }
];

const AppointmentsPage: React.FC = () => {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const { toast } = useToast();
  const { user } = useEhrAuth();
  
  const upcomingAppointments = sampleAppointments.filter(
    appt => new Date(appt.date) > new Date() && appt.status === 'scheduled'
  );
  
  const pastAppointments = sampleAppointments.filter(
    appt => new Date(appt.date) < new Date() || appt.status === 'completed'
  );
  
  const handleScheduleAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedPatient || !selectedProvider || !appointmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Appointment Scheduled",
      description: `Appointment scheduled for ${selectedDate} at ${selectedTime}`,
    });
    
    setIsScheduleDialogOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setSelectedDate('');
    setSelectedTime('');
    setSelectedPatient('');
    setSelectedProvider('');
    setAppointmentType('');
    setAppointmentNotes('');
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled successfully.",
    });
  };
  
  const handleCompleteAppointment = (appointmentId: string) => {
    toast({
      title: "Appointment Completed",
      description: "The appointment has been marked as completed.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Schedule New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details to schedule a new appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="date">Date</label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="time">Time</label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                    <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                    <SelectItem value="01:30 PM">01:30 PM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="02:30 PM">02:30 PM</SelectItem>
                    <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                    <SelectItem value="03:30 PM">03:30 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                    <SelectItem value="04:30 PM">04:30 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="patient">Patient</label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPatients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="provider">Provider</label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProviders.map(provider => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name} ({provider.specialty})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="type">Appointment Type</label>
                <Select value={appointmentType} onValueChange={setAppointmentType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Annual Check-up">Annual Check-up</SelectItem>
                    <SelectItem value="Urgent Care">Urgent Care</SelectItem>
                    <SelectItem value="Specialist Referral">Specialist Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="notes">Notes (Optional)</label>
                <Input
                  id="notes"
                  placeholder="Additional notes for the appointment"
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleScheduleAppointment}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>View and manage your scheduled appointments</CardDescription>
                </div>
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start md:items-center gap-4 mb-4 md:mb-0">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <CalendarIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{appointment.patientName}</p>
                            <Badge variant="outline">{appointment.type}</Badge>
                          </div>
                          <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              <span>{appointment.providerName}</span>
                            </div>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm mt-1">Notes: {appointment.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleCompleteAppointment(appointment.id)}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border p-4 text-center text-muted-foreground">
                  No upcoming appointments. Schedule one today.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>Review your appointment history</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {pastAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pastAppointments.map(appointment => (
                    <div key={appointment.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-start md:items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{appointment.patientName}</p>
                            <Badge variant="secondary">{appointment.type}</Badge>
                          </div>
                          <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              <span>{appointment.providerName}</span>
                            </div>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm mt-1">Notes: {appointment.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border p-4 text-center text-muted-foreground">
                  No past appointments to display.
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-center border-t pt-3">
              <p className="text-sm text-muted-foreground">
                Showing {pastAppointments.length} past appointments
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsPage;
