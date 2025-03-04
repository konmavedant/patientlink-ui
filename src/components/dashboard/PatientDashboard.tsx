
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient, MedicalRecord, AccessPermission } from '../../types';
import { getPatientRecords, getPatientPermissions, getUserNotifications } from '../../data/mockData';
import { FileText, Calendar, ShieldCheck, AlertCircle, ChevronRight, Clock, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<'summary' | 'records' | 'access'>('summary');
  
  if (!currentUser || currentUser.type !== 'patient') {
    return <div className="p-6">Unauthorized access</div>;
  }
  
  const patient = currentUser as Patient;
  const records = getPatientRecords(patient.id);
  const permissions = getPatientPermissions(patient.id);
  const notifications = getUserNotifications(patient.id);
  
  // Latest records
  const latestRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3);
  
  // Pending access requests
  const pendingRequests = permissions.filter(p => !p.granted);
  
  // Active providers
  const activeProviders = permissions.filter(p => p.granted);
  
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {patient.name.split(' ')[0]}</h1>
        <p className="text-neutral-500 mt-1">Here's an overview of your health records and access permissions</p>
      </div>
      
      <Tabs defaultValue="summary" className="mb-8" onValueChange={(v) => setView(v as any)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="records">Recent Records</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {view === 'summary' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Patient Profile Card */}
          <Card className="md:col-span-2 lg:col-span-1 hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium flex items-center">
                Patient Profile
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto h-8 w-8 text-neutral-400 hover:text-neutral-900"
                  onClick={() => {}}
                >
                  <ChevronRight size={18} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-medical-light flex items-center justify-center text-medical-dark font-semibold text-xl">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{patient.name}</h3>
                  <p className="text-sm text-neutral-500">{patient.email}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Date of Birth</span>
                  <span className="font-medium">{patient.dob}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Blood Type</span>
                  <span className="font-medium">{patient.bloodType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Gender</span>
                  <span className="font-medium">{patient.gender}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Allergies</span>
                  <span className="font-medium">
                    {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Health Summary Card */}
          <Card className="hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium flex items-center">
                Health Summary
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto h-8 w-8 text-neutral-400 hover:text-neutral-900"
                  onClick={() => navigate('/records')}
                >
                  <ChevronRight size={18} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-medical-lightest flex items-center justify-center text-medical mr-3">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Medical Records</p>
                    <p className="text-sm text-neutral-500">{records.length} total records</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-warning-light flex items-center justify-center text-warning-dark mr-3">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Chronic Conditions</p>
                    <p className="text-sm text-neutral-500">
                      {patient.chronicConditions.length > 0 
                        ? patient.chronicConditions.join(', ') 
                        : 'None recorded'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-success-light flex items-center justify-center text-success-dark mr-3">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Last Check-up</p>
                    <p className="text-sm text-neutral-500">
                      {latestRecords.length > 0 
                        ? formatDistanceToNow(new Date(latestRecords[0].date), { addSuffix: true }) 
                        : 'No records'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Access Control Card */}
          <Card className="hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium flex items-center">
                Access Control
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto h-8 w-8 text-neutral-400 hover:text-neutral-900"
                  onClick={() => navigate('/access')}
                >
                  <ChevronRight size={18} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-medical-lightest flex items-center justify-center text-medical mr-3">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Active Providers</p>
                    <p className="text-sm text-neutral-500">{activeProviders.length} providers with access</p>
                  </div>
                </div>
                
                {pendingRequests.length > 0 && (
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-warning-light flex items-center justify-center text-warning-dark mr-3">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Pending Requests</p>
                      <p className="text-sm text-neutral-500">{pendingRequests.length} requests awaiting approval</p>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate('/access')}
                >
                  Manage Access Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Upload Health Data Card */}
          <Card className="md:col-span-2 lg:col-span-3 hover-lift">
            <CardHeader>
              <CardTitle className="text-xl font-medium">Upload Health Data</CardTitle>
              <CardDescription>
                Securely upload your personal health measurements to your blockchain-verified record
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 flex flex-col items-center justify-center h-32 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200 hover:bg-neutral-100 transition-colors cursor-pointer">
                  <Upload size={24} className="text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-neutral-400">PDF, JPG, PNG (max 10MB)</p>
                </div>
                
                <div className="md:w-64 space-y-4">
                  <div>
                    <p className="font-medium mb-1.5">Quick Measurements</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="justify-start">
                        Blood Pressure
                      </Button>
                      <Button size="sm" variant="outline" className="justify-start">
                        Blood Sugar
                      </Button>
                      <Button size="sm" variant="outline" className="justify-start">
                        Weight
                      </Button>
                      <Button size="sm" variant="outline" className="justify-start">
                        Temperature
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {view === 'records' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Medical Records</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/records')}>
              View All Records
            </Button>
          </div>
          
          {latestRecords.map((record) => (
            <Card key={record.id} className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-medical-lightest flex items-center justify-center text-medical mr-3 mt-1">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-medium">{record.type}</h3>
                      <span className="text-sm text-neutral-500">{record.date}</span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      Provider: {record.provider}
                    </p>
                    {record.diagnosis && (
                      <p className="text-sm">
                        <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                      </p>
                    )}
                    <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{record.notes}</p>
                    {record.prescription && (
                      <p className="text-sm mt-2">
                        <span className="font-medium">Prescription:</span> {record.prescription}
                      </p>
                    )}
                    {record.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-neutral-500 mb-1">Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                          {record.attachments.map((attachment, idx) => (
                            <span key={idx} className="text-xs bg-neutral-100 px-2 py-1 rounded-md">
                              {attachment}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {view === 'access' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Access Permissions</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/access')}>
              Manage All Permissions
            </Button>
          </div>
          
          {pendingRequests.length > 0 && (
            <Card className="border-warning-light">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Access Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{request.providerName}</p>
                        <p className="text-sm text-neutral-500">{request.providerSpecialty}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-error text-error hover:bg-error-light">
                          Deny
                        </Button>
                        <Button size="sm" className="bg-medical text-white hover:bg-medical-dark">
                          Grant Access
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Healthcare Providers</CardTitle>
            </CardHeader>
            <CardContent>
              {activeProviders.length > 0 ? (
                <div className="space-y-3">
                  {activeProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{provider.providerName}</p>
                        <p className="text-sm text-neutral-500">
                          {provider.providerSpecialty} · {provider.accessLevel} access
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="border-error text-error hover:bg-error-light">
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-sm">No active providers with access to your records</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
