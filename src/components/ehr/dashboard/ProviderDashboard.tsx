
import React, { useState, useEffect } from 'react';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockPatients, mockMedicalRecords, getAccessPermissionsByPatientId, getNotificationsByUserId } from '@/data/mockEhrData';
import { Search, Users, Calendar, FileText, ClipboardList, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Provider } from '@/types/ehr';
import { getAccessibleDocuments, getCurrentWalletAddress } from '@/services/blockchainService';

const ProviderDashboard: React.FC = () => {
  const { user } = useEhrAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [patientDocuments, setPatientDocuments] = useState<any[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  
  if (!user || user.role !== 'provider') return null;
  
  const provider = user as Provider;
  const notifications = getNotificationsByUserId(provider.id);
  
  // Get patients with access granted to this provider
  const patientsWithAccess = mockPatients.filter(patient => {
    const permissions = getAccessPermissionsByPatientId(patient.id);
    return permissions.some(p => p.providerId === provider.id && p.status === 'granted');
  });
  
  // Filter patients based on search query
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get counts for the dashboard cards
  const totalPatientsCount = patientsWithAccess.length;
  const pendingAccessCount = mockPatients.filter(patient => {
    const permissions = getAccessPermissionsByPatientId(patient.id);
    return permissions.some(p => p.providerId === provider.id && p.status === 'pending');
  }).length;
  
  // Calculate total records managed
  const totalRecordsCount = patientsWithAccess.reduce((count, patient) => {
    const patientRecords = mockMedicalRecords[patient.id] || [];
    return count + patientRecords.filter(record => record.providerId === provider.id).length;
  }, 0);
  
  const todayDate = new Date().toLocaleDateString();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    // Check if wallet is connected when component mounts
    const checkWalletConnection = async () => {
      const walletAddress = await getCurrentWalletAddress();
      setWalletConnected(!!walletAddress);
    };
    
    checkWalletConnection();
    
    // Set up event listener for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setWalletConnected(accounts.length > 0);
      });
    }
    
    return () => {
      // Clean up event listener
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);
  
  useEffect(() => {
    const loadPatientDocuments = async () => {
      const providerAddress = await getCurrentWalletAddress();
      if (!providerAddress) return;
      
      // For each patient with access granted
      for (const patient of patientsWithAccess) {
        if (patient.walletAddress) {
          const documents = await getAccessibleDocuments(providerAddress, patient.walletAddress);
          setPatientDocuments(prev => [...prev, ...documents]);
        }
      }
    };
    
    if (walletConnected && patientsWithAccess.length > 0) {
      loadPatientDocuments();
    }
  }, [walletConnected, patientsWithAccess]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {provider.name}</h1>
          <p className="text-muted-foreground">
            {provider.specialty} at {provider.hospital || 'Independent Practice'}
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayDate}</div>
            <p className="text-xs text-muted-foreground">Current date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatientsCount}</div>
            <p className="text-xs text-muted-foreground">Patients under your care</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Records Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecordsCount}</div>
            <p className="text-xs text-muted-foreground">Medical documents authored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAccessCount}</div>
            <p className="text-xs text-muted-foreground">Access requests pending</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="search">
        <TabsList>
          <TabsTrigger value="search">Patient Search</TabsTrigger>
          <TabsTrigger value="patients">Your Patients</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Patient</CardTitle>
              <CardDescription>Search for patients by name or email</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {searchQuery && filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => {
                    const patientInitials = getInitials(patient.name);
                    const permissions = getAccessPermissionsByPatientId(patient.id);
                    const permission = permissions.find(p => p.providerId === provider.id);
                    const hasAccess = permission?.status === 'granted';
                    const pendingAccess = permission?.status === 'pending';

                    return (
                      <div key={patient.id} className="flex items-center gap-4 rounded-lg border p-4">
                        <Avatar>
                          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                          <AvatarFallback>{patientInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">{patient.email}</p>
                            </div>
                            {hasAccess ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                                Access Granted
                              </Badge>
                            ) : pendingAccess ? (
                              <Badge variant="outline" className="border-amber-200 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-500">
                                Request Pending
                              </Badge>
                            ) : (
                              <Badge variant="outline">No Access</Badge>
                            )}
                          </div>
                          <div className="mt-2 flex gap-2">
                            {hasAccess ? (
                              <Button 
                                size="sm" 
                                onClick={() => navigate(`/patients/${patient.id}`)}
                              >
                                View Records
                              </Button>
                            ) : !pendingAccess ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  console.log(`Requesting access to patient: ${patient.id}`);
                                  // In a real app, this would send a request
                                }}
                              >
                                Request Access
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                disabled
                              >
                                Awaiting Response
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : searchQuery ? (
                  <p className="text-center text-muted-foreground">No patients found matching "{searchQuery}"</p>
                ) : (
                  <p className="text-center text-muted-foreground">Enter a search term to find patients</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="patients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Patients</CardTitle>
              <CardDescription>Patients who have granted you access to their records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientsWithAccess.length > 0 ? (
                  patientsWithAccess.map((patient) => {
                    const patientInitials = getInitials(patient.name);
                    const patientRecords = mockMedicalRecords[patient.id] || [];
                    const recordsCount = patientRecords.length;
                    const lastVisit = patientRecords.length > 0 
                      ? new Date(patientRecords[0].date).toLocaleDateString() 
                      : 'N/A';

                    return (
                      <div key={patient.id} className="flex items-center gap-4 rounded-lg border p-4">
                        <Avatar>
                          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                          <AvatarFallback>{patientInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span>Records: {recordsCount}</span>
                                <span className="mx-2">•</span>
                                <span>Last visit: {lastVisit}</span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => navigate(`/patients/${patient.id}`)}
                            >
                              View Records
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground">You don't have any patients yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
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
                          <ClipboardList className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Calendar className="h-4 w-4 text-gray-500" />
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
                  <p className="text-center text-muted-foreground">No recent activities</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;
