
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Provider, Patient } from '../../types';
import { getPatientsByProvider, getUserNotifications } from '../../data/mockData';
import { Users, Search, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!currentUser || currentUser.type !== 'provider') {
    return <div className="p-6">Unauthorized access</div>;
  }
  
  const provider = currentUser as Provider;
  const myPatients = getPatientsByProvider(provider.id);
  const notifications = getUserNotifications(provider.id);
  
  // Filter patients based on search query
  const filteredPatients = myPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Mock stats
  const stats = {
    patients: myPatients.length,
    pendingRequests: 2,
    recentRecords: 8
  };
  
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Dr. {provider.name.split(' ')[1]}</h1>
        <p className="text-neutral-500 mt-1">Here's an overview of your patients and recent activities</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Provider Profile Card */}
        <Card className="md:col-span-2 lg:col-span-1 hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Provider Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-medical-light flex items-center justify-center text-medical-dark font-semibold text-xl">
                {provider.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-medium">{provider.name}</h3>
                <p className="text-sm text-neutral-500">{provider.email}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Specialty</span>
                <span className="font-medium">{provider.specialty}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Hospital</span>
                <span className="font-medium">{provider.hospitalAffiliation}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">License</span>
                <span className="font-medium">{provider.licenseNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Patient Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-medical-lightest flex items-center justify-center text-medical mr-3">
                  <Users size={20} />
                </div>
                <div>
                  <p className="font-medium">My Patients</p>
                  <p className="text-sm text-neutral-500">{stats.patients} patients under your care</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-warning-light flex items-center justify-center text-warning-dark mr-3">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="font-medium">Pending Requests</p>
                  <p className="text-sm text-neutral-500">{stats.pendingRequests} access requests sent</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-success-light flex items-center justify-center text-success-dark mr-3">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-medium">Recent Updates</p>
                  <p className="text-sm text-neutral-500">{stats.recentRecords} records added this week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Notifications Card */}
        <Card className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 3).map(notification => (
                <div key={notification.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-neutral-50">
                  <div className="mt-0.5">
                    {notification.type === 'access' && (
                      <ShieldCheck className="h-5 w-5 text-medical" />
                    )}
                    {notification.type === 'record' && (
                      <FileText className="h-5 w-5 text-success" />
                    )}
                    {notification.type === 'appointment' && (
                      <Calendar className="h-5 w-5 text-warning" />
                    )}
                    {notification.type === 'assignment' && (
                      <User className="h-5 w-5 text-medical" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-neutral-500">{notification.message}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
              
              {notifications.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full text-medical text-sm mt-2">
                  View all notifications
                </Button>
              )}
              
              {notifications.length === 0 && (
                <p className="text-neutral-500 text-sm">No recent notifications</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Patient Search Section */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium">Patient Search</CardTitle>
            <CardDescription>
              Find patients by name or email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                className="pl-9"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <div 
                    key={patient.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border border-neutral-200">
                        <AvatarImage src={patient.profileImage} alt={patient.name} />
                        <AvatarFallback className="bg-medical-light text-medical-dark">
                          {getInitials(patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-neutral-500">
                          DOB: {patient.dob} · {patient.gender}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-medical">
                      View Records
                    </Button>
                  </div>
                ))
              ) : (
                searchQuery ? (
                  <p className="text-neutral-500 text-center py-4">No patients found matching "{searchQuery}"</p>
                ) : (
                  <p className="text-neutral-500 text-center py-4">You don't have access to any patient records yet</p>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Request Access Section */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium">Request Access</CardTitle>
            <CardDescription>
              Request access to a new patient's records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1.5 block">Patient ID / Email</label>
                <Input placeholder="Enter patient ID or email address" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Access Level</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm">
                  <option value="full">Full Access</option>
                  <option value="limited">Limited Access</option>
                  <option value="emergency">Emergency Access</option>
                </select>
              </div>
              <div>
                <Button className="bg-medical hover:bg-medical-dark w-full md:w-auto">
                  Request Access
                </Button>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Recent Access Requests</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-md border border-neutral-200">
                  <div>
                    <p className="font-medium">Sarah Wilson</p>
                    <p className="text-xs text-neutral-500">Requested 3 days ago</p>
                  </div>
                  <div className="flex items-center space-x-1 text-warning">
                    <Clock size={16} />
                    <span className="text-sm">Pending</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-md border border-neutral-200">
                  <div>
                    <p className="font-medium">Michael Brown</p>
                    <p className="text-xs text-neutral-500">Requested 5 days ago</p>
                  </div>
                  <div className="flex items-center space-x-1 text-success">
                    <CheckCircle size={16} />
                    <span className="text-sm">Approved</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-md border border-neutral-200">
                  <div>
                    <p className="font-medium">Emily Johnson</p>
                    <p className="text-xs text-neutral-500">Requested 7 days ago</p>
                  </div>
                  <div className="flex items-center space-x-1 text-error">
                    <XCircle size={16} />
                    <span className="text-sm">Denied</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Add missing imports
import { Calendar, ShieldCheck, User } from 'lucide-react';

export default ProviderDashboard;
