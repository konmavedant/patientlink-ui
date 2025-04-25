
import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, FilePlus, X, Loader2, Check, File } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { toast } from '@/components/ui/use-toast';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { getCurrentWalletAddress, grantAccess } from '@/services/blockchainService';
import ConnectWallet from '@/components/ehr/wallet/ConnectWallet';
import { MedicalRecord, Provider } from '@/types/ehr';
import { mockPatients, mockProviders } from '@/data/mockEhrData';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  hash: string;
  registered: boolean;
  preview?: string;
  record?: MedicalRecord;
}

const UploadDataPage: React.FC = () => {
  const { user } = useEhrAuth();
  const { uploadDocument, isUploading } = useDocumentUpload();
  const [dragActive, setDragActive] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [accessGranting, setAccessGranting] = useState<Record<string, boolean>>({});
  
  // Load saved documents from localStorage on component mount
  useEffect(() => {
    try {
      const savedDocs = localStorage.getItem('uploadedDocuments');
      if (savedDocs) {
        const parsedDocs = JSON.parse(savedDocs);
        // Convert string dates back to Date objects
        const docsWithDates = parsedDocs.map((doc: any) => ({
          ...doc,
          uploadDate: new Date(doc.uploadDate)
        }));
        setUploadedDocuments(docsWithDates);
      }
    } catch (error) {
      console.error("Error loading saved documents:", error);
    }
    
    // Load mock providers
    setProviders(mockProviders);
  }, []);
  
  // Save documents to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('uploadedDocuments', JSON.stringify(uploadedDocuments));
    } catch (error) {
      console.error("Error saving documents:", error);
    }
  }, [uploadedDocuments]);

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: "eth_accounts" 
          });
          setWalletConnected(accounts.length > 0);
          
          window.ethereum.on("accountsChanged", (accounts: string[]) => {
            setWalletConnected(accounts.length > 0);
          });
        } catch (error) {
          console.error("Error checking wallet:", error);
        }
      }
    };
    
    checkWallet();
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || !walletConnected) {
      if (!walletConnected) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to upload documents",
          variant: "destructive",
        });
      }
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type. Please upload JPG, PNG, or PDF files.`,
          variant: "destructive",
        });
        continue;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 10MB size limit.`,
          variant: "destructive",
        });
        continue;
      }
      
      const { success, hash, record } = await uploadDocument(file, user?.id);
      
      if (success && hash) {
        // Generate preview for images
        let preview = undefined;
        if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file);
        }
        
        const newDocument: UploadedDocument = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date(),
          hash,
          registered: true,
          preview,
          record
        };
        
        setUploadedDocuments(prev => [newDocument, ...prev]);
        
        toast({
          title: "Upload Successful",
          description: `${file.name} was successfully uploaded and registered on the blockchain.`,
        });
      }
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    processFiles(e.dataTransfer.files);
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileText className="h-6 w-6" />;
    } else if (fileType === 'application/pdf') {
      return <FilePlus className="h-6 w-6" />;
    } else {
      return <File className="h-6 w-6" />;
    }
  };
  
  const handleGrantAccess = async (document: UploadedDocument, provider: Provider) => {
    if (!provider.walletAddress) {
      toast({
        title: "Provider Not Found",
        description: "The selected provider does not have a wallet address.",
        variant: "destructive",
      });
      return;
    }
    
    setAccessGranting({...accessGranting, [document.id]: true});
    
    try {
      const success = await grantAccess(provider.walletAddress, document.hash);
      
      if (success) {
        toast({
          title: "Access Granted",
          description: `${provider.name} now has access to this document.`,
        });
      }
    } catch (error) {
      console.error("Error granting access:", error);
      toast({
        title: "Error",
        description: "Failed to grant access to the provider.",
        variant: "destructive",
      });
    } finally {
      setAccessGranting({...accessGranting, [document.id]: false});
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Upload Medical Data</h1>
      
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Upload medical documents securely to the blockchain
        </p>
        <ConnectWallet />
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>Share your medical records securely</CardDescription>
            </div>
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center ${
              dragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Drag and drop files here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: PDF, JPG, PNG
              </p>
              
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="default" size="default" disabled={isUploading || !walletConnected}>
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : !walletConnected ? (
                      "Connect Wallet First"
                    ) : (
                      "Browse Files"
                    )}
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                    disabled={isUploading || !walletConnected}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Upload Guidelines</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Files must be less than 10MB</li>
              <li>Personal information should be clearly visible</li>
              <li>Ensure document quality is readable</li>
              <li>Your uploads are encrypted and secure</li>
              <li>Connect your wallet to register documents on blockchain</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Documents you've recently added</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {uploadedDocuments.length > 0 ? (
            <div className="space-y-4">
              {uploadedDocuments.map((document) => (
                <div key={document.id} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="flex-shrink-0 p-2 bg-muted rounded-md">
                    {getFileIcon(document.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{document.name}</h4>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{document.type.split('/')[1].toUpperCase()}</Badge>
                      <span className="text-xs text-muted-foreground">{formatFileSize(document.size)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-muted-foreground">
                        Uploaded: {document.uploadDate.toLocaleString()}
                      </div>
                      
                      {document.registered ? (
                        <div className="flex items-center text-xs text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Registered on Blockchain
                        </div>
                      ) : null}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Share with Provider
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Grant Access to Provider</DialogTitle>
                            <DialogDescription>
                              Select a healthcare provider to grant access to this document.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 my-4">
                            {providers.map(provider => (
                              <div key={provider.id} className="flex items-center justify-between p-3 border rounded-md">
                                <div>
                                  <p className="font-medium">{provider.name}</p>
                                  <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                                </div>
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  onClick={() => handleGrantAccess(document, provider)}
                                  disabled={accessGranting[document.id]}
                                >
                                  {accessGranting[document.id] ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                  )}
                                  Grant Access
                                </Button>
                              </div>
                            ))}
                            
                            {providers.length === 0 && (
                              <p className="text-center text-muted-foreground">No providers available</p>
                            )}
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {}} className="w-full">Done</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      {document.preview && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Preview Document
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{document.name}</DialogTitle>
                              <DialogDescription>
                                Uploaded {document.uploadDate.toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="flex items-center justify-center p-2 bg-muted rounded-lg">
                              <img 
                                src={document.preview} 
                                alt={document.name} 
                                className="max-h-[70vh] max-w-full object-contain"
                              />
                            </div>
                            
                            <DialogFooter>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Document Hash: {document.hash.slice(0, 10)}...{document.hash.slice(-10)}</span>
                              </div>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border">
              <div className="p-4 text-center text-muted-foreground">
                No recent uploads to display.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDataPage;
