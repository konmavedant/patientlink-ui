
import React, { useState } from 'react';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { Lock, Shield, AlertTriangle, Check, X, Clock, Calendar, User, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  getAccessPermissionsByPatientId, 
  mockProviders, 
  getAuditLogsByPatientId 
} from '@/data/mockEhrData';
import { AccessPermission, AuditLogEntry } from '@/types/ehr';
import { formatDistanceToNow } from 'date-fns';

const AccessManagementPage: React.FC = () => {
  const { user } = useEhrAuth();
  const { toast } = useToast();
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<AccessPermission | null>(null);
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [expirationDays, setExpirationDays] = useState('90');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  if (!user || user.role !== 'patient') {
    return (
      <Card className="p-6">
        <CardTitle className="mb-4">Access Restricted</CardTitle>
        <p>Only patients can manage access permissions.</p>
      </Card>
    );
  }
  
  const patientId = user.id;
  const permissions = getAccessPermissionsByPatientId(patientId);
  const auditLogs = getAuditLogsByPatientId(patientId);
  
  // Get providers who don't already have access
  const providersWithoutAccess = mockProviders.filter(provider => 
    !permissions.some(p => p.providerId === provider.id)
  );
  
  // Filter permissions based on status
  const filteredPermissions = statusFilter === 'all' 
    ? permissions 
    : permissions.filter(p => p.status === statusFilter);
  
  // Filter audit logs related to access
  const accessLogs = auditLogs.filter(log => 
    log.action === 'grant' || log.action === 'revoke'
  );
  
  // Get access logs - who viewed the records
  const viewLogs = auditLogs.filter(log => 
    log.action === 'view' && log.performedBy.role === 'provider'
  );
  
  const handleRevokeAccess = () => {
    if (selectedPermission) {
      toast({
        title: "Access Revoked",
        description: `Access for ${selectedPermission.providerName} has been revoked.`,
      });
      setIsRevokeDialogOpen(false);
      setSelectedPermission(null);
    }
  };
  
  const handleGrantAccess = () => {
    if (selectedProviderId) {
      const provider = mockProviders.find(p => p.id === selectedProviderId);
      
      if (provider) {
        toast({
          title: "Access Granted",
          description: `Access has been granted to ${provider.name} for ${expirationDays} days.`,
        });
        setIsGrantDialogOpen(false);
        setSelectedProviderId('');
      }
    }
  };
  
  const openRevokeDialog = (permission: AccessPermission) => {
    setSelectedPermission(permission);
    setIsRevokeDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Access Management</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permission Settings</CardTitle>
              <CardDescription>Control who can access your health data</CardDescription>
            </div>
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="current">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="current">Current Access</TabsTrigger>
                <TabsTrigger value="pending">Pending Requests</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Permissions</SelectItem>
                    <SelectItem value="granted">Granted Only</SelectItem>
                    <SelectItem value="pending">Pending Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="current">
              <div className="rounded-lg border">
                {filteredPermissions.length > 0 ? (
                  <div className="divide-y">
                    {filteredPermissions.map((permission) => (
                      <div key={permission.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={`https://i.pravatar.cc/150?img=${permission.providerId.replace('doc', '')}`} alt={permission.providerName} />
                              <AvatarFallback>{permission.providerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{permission.providerName}</p>
                              <p className="text-sm text-muted-foreground">{permission.providerSpecialty}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {permission.status === 'granted' ? (
                              <>
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400 mr-2">
                                  Active
                                </Badge>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openRevokeDialog(permission)}
                                >
                                  Revoke Access
                                </Button>
                              </>
                            ) : (
                              <>
                                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400 mr-2">
                                  Pending
                                </Badge>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    toast({
                                      title: "Request Cancelled",
                                      description: `Access request for ${permission.providerName} has been cancelled.`,
                                    });
                                  }}
                                >
                                  Cancel Request
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {permission.status === 'granted' && (
                          <div className="mt-3 text-sm">
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3.5 w-3.5" />
                                <span>Granted: {new Date(permission.dateModified).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3.5 w-3.5" />
                                <span>Expires: {new Date(permission.expirationDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <Shield className="h-8 w-8 text-muted-foreground mb-1" />
                    {statusFilter === 'all' ? (
                      <p>You haven't granted access to any providers yet</p>
                    ) : (
                      <p>No {statusFilter} permissions found</p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pending">
              <div className="rounded-lg border">
                {permissions.filter(p => p.status === 'pending').length > 0 ? (
                  <div className="divide-y">
                    {permissions
                      .filter(p => p.status === 'pending')
                      .map((permission) => (
                        <div key={permission.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={`https://i.pravatar.cc/150?img=${permission.providerId.replace('doc', '')}`} alt={permission.providerName} />
                                <AvatarFallback>{permission.providerName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{permission.providerName}</p>
                                <p className="text-sm text-muted-foreground">{permission.providerSpecialty}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400 mr-2">
                                Pending
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Request Cancelled",
                                    description: `Access request for ${permission.providerName} has been cancelled.`,
                                  });
                                }}
                              >
                                Cancel Request
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="mr-1 h-3.5 w-3.5" />
                              <span>Requested: {new Date(permission.dateRequested).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                  }
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <Check className="h-8 w-8 text-muted-foreground mb-1" />
                    <p>No pending access requests</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="px-6 border-t pt-4">
          <Button onClick={() => setIsGrantDialogOpen(true)}>
            Grant New Access
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Access History</CardTitle>
          <CardDescription>Record of access changes to your health data</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            {accessLogs.length > 0 ? (
              <div className="divide-y">
                {accessLogs.map((log) => (
                  <div key={log.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className={log.action === 'grant' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {log.action === 'grant' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {log.action === 'grant' ? 'Access Granted' : 'Access Revoked'}
                        </p>
                        <p className="text-sm text-muted-foreground">{log.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No access changes have been made yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Record Access Log</CardTitle>
          <CardDescription>Who has viewed your medical records</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border">
            {viewLogs.length > 0 ? (
              <div className="divide-y">
                {viewLogs.map((log) => (
                  <div key={log.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?img=${log.performedBy.id.replace('doc', '')}`} alt={log.performedBy.name} />
                        <AvatarFallback>{log.performedBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {log.performedBy.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {log.recordType ? `Viewed your ${log.recordType} record` : 'Viewed your medical records'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground flex flex-col items-center gap-2">
                <User className="h-8 w-8 text-muted-foreground mb-1" />
                <p>No record access has been logged yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Revoke Access Dialog */}
      <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke access for {selectedPermission?.providerName}?
              They will no longer be able to view your medical records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevokeDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeAccess}>
              Revoke Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Grant Access Dialog */}
      <Dialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Access</DialogTitle>
            <DialogDescription>
              Select a healthcare provider to grant access to your medical records.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="provider" className="text-sm font-medium">
                Healthcare Provider
              </label>
              <Select value={selectedProviderId} onValueChange={setSelectedProviderId}>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providersWithoutAccess.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} - {provider.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="expiration" className="text-sm font-medium">
                Access Duration (days)
              </label>
              <Input
                id="expiration"
                type="number"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                min="1"
                max="365"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGrantDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGrantAccess} disabled={!selectedProviderId}>
              Grant Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessManagementPage;
