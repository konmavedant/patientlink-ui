import React from 'react';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { getMedicalRecordsByPatientId, getAccessPermissionsByPatientId, getNotificationsByUserId } from '@/data/mockEhrData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Clock, FileText, Users, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Patient } from '@/types/ehr';

const PatientDashboard: React.FC = () => {
  const { user } = useEhrAuth();
  
  if (!user || user.role !== 'patient') return null;
  
  const patient = user as Patient;
  const medicalRecords = getMedicalRecordsByPatientId(patient.id);
  const accessPermissions = getAccessPermissionsByPatientId(patient.id);
  const notifications = getNotificationsByUserId(patient.id);
  
  const recentRecords = medicalRecords.slice(0, 3);
  const pendingAccessRequests = accessPermissions.filter(permission => permission.status === 'pending');
  const activeProviders = accessPermissions.filter(permission => permission.status === 'granted');
  const unreadNotifications = notifications.filter(notification => !notification.read);

  // Calculate some stats for the dashboard
  const totalRecords = medicalRecords.length;
  const lastVisitDate = medicalRecords.length > 0 
    ? new Date(medicalRecords[0].date).toLocaleDateString() 
    : 'N/A';
  
  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <CalendarDays className="h-4 w-4" />;
      case 'diagnosis':
        return <Activity className="h-4 w-4" />;
      case 'prescription':
        return <FileText className="h-4 w-4" />;
      case 'lab':
        return <Activity className="h-4 w-4" />;
      case 'vaccination':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {patient.name}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your health records and activity
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">Medical documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastVisitDate}</div>
            <p className="text-xs text-muted-foreground">Date of last appointment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProviders.length}</div>
            <p className="text-xs text-muted-foreground">With access to your records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAccessRequests.length}</div>
            <p className="text-xs text-muted-foreground">Access requests awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Medical Records</CardTitle>
              <CardDescription>Your latest health information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRecords.length > 0 ? (
                  recentRecords.map((record) => (
                    <div key={record.id} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="mt-1">
                        {getRecordTypeIcon(record.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{record.title}</p>
                          <Badge variant="outline" className="ml-2">
                            {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {record.description}
                        </p>
                        <div className="flex items-center pt-1 text-xs text-muted-foreground">
                          <span>{record.providerName}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No recent records found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="providers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Healthcare Providers</CardTitle>
              <CardDescription>Providers with access to your medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeProviders.length > 0 ? (
                  activeProviders.map((permission) => (
                    <div key={permission.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <Avatar>
                        <AvatarFallback>{permission.providerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{permission.providerName}</p>
                          <Badge>{permission.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{permission.providerSpecialty}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Access granted: {new Date(permission.dateModified || permission.dateRequested).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No active providers</p>
                )}
                
                {pendingAccessRequests.length > 0 && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-2 text-muted-foreground">Pending Requests</span>
                      </div>
                    </div>
                    
                    {pendingAccessRequests.map((permission) => (
                      <div key={permission.id} className="flex items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:bg-amber-900/20 dark:border-amber-800">
                        <Avatar>
                          <AvatarFallback>{permission.providerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{permission.providerName}</p>
                            <Badge variant="outline" className="text-amber-600 bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-500">
                              {permission.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{permission.providerSpecialty}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Requested: {new Date(permission.dateRequested).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Updates and alerts related to your health records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start gap-4 rounded-lg border p-4 ${
                        !notification.read ? 'bg-primary/5 border-primary/20' : ''
                      }`}
                    >
                      <div className="mt-1">
                        {notification.type === 'access' ? (
                          <Users className="h-4 w-4 text-blue-500" />
                        ) : notification.type === 'update' ? (
                          <FileText className="h-4 w-4 text-green-500" />
                        ) : notification.type === 'alert' ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Activity className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{notification.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <Badge className="mt-2 text-xs" variant="secondary">New</Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No notifications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;
