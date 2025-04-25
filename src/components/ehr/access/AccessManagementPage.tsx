
import React, { useState, useEffect } from 'react';
import { Lock, Shield, AlertTriangle, CheckCircle, Users, FileText, X, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { getAccessPermissionsByPatientId, getMedicalRecordsByPatientId, getProviderById } from '@/data/mockEhrData';
import ConnectWallet from '@/components/ehr/wallet/ConnectWallet';
import { toast } from '@/components/ui/use-toast';
import { grantAccess, revokeAccess, checkAccess } from '@/services/blockchainService';

interface AccessRequest {
  id: string;
  providerName: string;
  providerId: string;
  providerAddress: string;
  documentName: string;
  documentHash: string;
  requestDate: Date;
  status: 'pending' | 'granted' | 'denied';
}

const AccessManagementPage: React.FC = () => {
  const { user } = useEhrAuth();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [providerSearchInput, setProviderSearchInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Sample access requests (in a real app, these would come from the blockchain)
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [accessHistory, setAccessHistory] = useState<AccessRequest[]>([]);
  
  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: "eth_accounts" 
          });
          setWalletConnected(accounts.length > 0);
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
          
          window.ethereum.on("accountsChanged", (accounts: string[]) => {
            setWalletConnected(accounts.length > 0);
            if (accounts.length > 0) {
              setWalletAddress(accounts[0]);
            } else {
              setWalletAddress(null);
            }
          });
        } catch (error) {
          console.error("Error checking wallet:", error);
        }
      }
    };
    
    // Load mock data
    if (user && user.role === 'patient') {
      const mockPermissions = getAccessPermissionsByPatientId(user.id);
      const mockRecords = getMedicalRecordsByPatientId(user.id);
      
      // Create mock access requests
      const mockRequests: AccessRequest[] = mockPermissions
        .filter(p => p.status === 'pending')
        .map(p => ({
          id: crypto.randomUUID(),
          providerName: p.providerName,
          providerId: p.providerId,
          providerAddress: `0x${p.providerId.substring(0, 40)}`,
          documentName: mockRecords[0]?.title || "Medical Record",
          documentHash: `0x${crypto.randomUUID().replace(/-/g, '')}`,
          requestDate: new Date(p.dateRequested),
          status: 'pending'
        }));
        
      // Create mock access history
      const mockHistory: AccessRequest[] = mockPermissions
        .filter(p => p.status !== 'pending')
        .map(p => ({
          id: crypto.randomUUID(),
          providerName: p.providerName,
          providerId: p.providerId,
          providerAddress: `0x${p.providerId.substring(0, 40)}`,
          documentName: mockRecords[0]?.title || "Medical Record",
          documentHash: `0x${crypto.randomUUID().replace(/-/g, '')}`,
          requestDate: new Date(p.dateRequested),
          status: p.status as 'granted' | 'pending' | 'denied'
        }));
      
      setAccessRequests(mockRequests);
      setAccessHistory(mockHistory);
    }
    
    checkWallet();
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, [user]);
  
  const handleGrantAccess = async (request: AccessRequest) => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to manage document access",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const success = await grantAccess(request.providerAddress, request.documentHash);
      
      if (success) {
        // Update local state
        const updatedRequest = {...request, status: 'granted'};
        
        setAccessRequests(prev => prev.filter(req => req.id !== request.id));
        setAccessHistory(prev => [updatedRequest, ...prev]);
        
        toast({
          title: "Access Granted",
          description: `${request.providerName} can now access this document`,
        });
      }
    } catch (error) {
      console.error("Error granting access:", error);
      toast({
        title: "Action Failed",
        description: "Failed to grant access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDenyAccess = async (request: AccessRequest) => {
    setIsProcessing(true);
    
    try {
      // Update local state only for demo
      const updatedRequest = {...request, status: 'denied'};
      
      setAccessRequests(prev => prev.filter(req => req.id !== request.id));
      setAccessHistory(prev => [updatedRequest, ...prev]);
      
      toast({
        title: "Access Denied",
        description: `Access request from ${request.providerName} has been denied`,
      });
    } catch (error) {
      console.error("Error denying access:", error);
      toast({
        title: "Action Failed",
        description: "Failed to deny access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRevokeAccess = async (request: AccessRequest) => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to manage document access",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const success = await revokeAccess(request.providerAddress, request.documentHash);
      
      if (success) {
        // Update local state
        const updatedRequest = {...request, status: 'denied'};
        
        setAccessHistory(prev => 
          prev.map(item => item.id === request.id ? updatedRequest : item)
        );
        
        toast({
          title: "Access Revoked",
          description: `${request.providerName}'s access has been revoked`,
        });
      }
    } catch (error) {
      console.error("Error revoking access:", error);
      toast({
        title: "Action Failed",
        description: "Failed to revoke access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProviderSearch = () => {
    // In a real application, this would search for providers
    // For demo, we'll just show a toast
    toast({
      title: "Provider Search",
      description: "This would search for healthcare providers in a real application",
    });
  };
  
  if (!user) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Access Management</h1>
        <ConnectWallet />
      </div>
      
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
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Default Privacy Settings</h3>
                <p className="text-sm text-muted-foreground">Your data is private by default</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Grant Access to a Provider</h3>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by provider name or address..."
                    value={providerSearchInput}
                    onChange={(e) => setProviderSearchInput(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleProviderSearch}>Search</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Search for a healthcare provider to grant them access to specific documents
              </p>
            </div>
            
            {!walletConnected && (
              <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4 dark:bg-amber-900/20 dark:border-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="font-medium">Connect Your Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    You need to connect your wallet to manage document access
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Access Requests</CardTitle>
          <CardDescription>Pending permission requests from healthcare providers</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {accessRequests.length > 0 ? (
            <div className="space-y-4">
              {accessRequests.map((request) => (
                <div key={request.id} className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:bg-amber-900/20 dark:border-amber-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-amber-600" />
                      <div>
                        <h3 className="font-medium">{request.providerName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {request.providerAddress.slice(0, 6)}...{request.providerAddress.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-amber-600 bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-500">
                      Pending
                    </Badge>
                  </div>
                  
                  <div className="mt-3 p-3 bg-white rounded border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{request.documentName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Request date: {request.requestDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDenyAccess(request)}
                      disabled={isProcessing}
                    >
                      Deny
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleGrantAccess(request)}
                      disabled={isProcessing || !walletConnected}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Processing...
                        </>
                      ) : (
                        "Grant Access"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border">
              <div className="p-4 text-center text-muted-foreground">
                No pending access requests.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Access History</CardTitle>
          <CardDescription>Who has access to your records</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {accessHistory.length > 0 ? (
            <div className="space-y-4">
              {accessHistory.map((item) => (
                <div 
                  key={item.id} 
                  className={`rounded-lg border p-4 ${
                    item.status === 'granted' 
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                      : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className={`h-5 w-5 ${
                        item.status === 'granted' ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <div>
                        <h3 className="font-medium">{item.providerName}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.providerAddress.slice(0, 6)}...{item.providerAddress.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        item.status === 'granted' 
                          ? 'text-green-600 bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-500'
                          : 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-500'
                      }
                    >
                      {item.status === 'granted' ? 'Access Granted' : 'Access Denied'}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 p-3 bg-white rounded border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{item.documentName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.status === 'granted' ? 'Granted' : 'Last updated'}: {item.requestDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {item.status === 'granted' && (
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRevokeAccess(item)}
                        disabled={isProcessing || !walletConnected}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Processing...
                          </>
                        ) : (
                          "Revoke Access"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border">
              <div className="p-4 text-center text-muted-foreground">
                No access history to display.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessManagementPage;
