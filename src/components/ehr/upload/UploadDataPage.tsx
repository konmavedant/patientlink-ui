
import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, FilePlus, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { registerDocument } from '@/services/blockchainService';
import ConnectWallet from '@/components/ehr/wallet/ConnectWallet';
import { Badge } from '@/components/ui/badge';
import { ethers } from 'ethers';

// Simple hash function for demo purposes
const hashDocument = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  hash: string;
  registered: boolean;
  preview?: string;
}

const UploadDataPage: React.FC = () => {
  const { user } = useEhrAuth();
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  
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
    if (!files) return;
    
    setIsUploading(true);
    
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const newDocuments: UploadedDocument[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type and size
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
      
      // Create document hash
      const hash = await hashDocument(file);
      
      // Generate preview for images
      let preview = undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }
      
      newDocuments.push({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        hash,
        registered: false,
        preview
      });
    }
    
    setUploadedDocuments(prev => [...newDocuments, ...prev]);
    
    if (newDocuments.length > 0) {
      toast({
        title: "Files Uploaded",
        description: `Successfully uploaded ${newDocuments.length} file(s)`,
      });
    }
    
    setIsUploading(false);
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
  
  const handleRegisterDocument = async (document: UploadedDocument) => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to register documents on blockchain",
        variant: "destructive",
      });
      return;
    }
    
    setIsRegistering(true);
    
    try {
      const success = await registerDocument(document.hash, document.type);
      
      if (success) {
        setUploadedDocuments(prev => 
          prev.map(doc => 
            doc.id === document.id ? { ...doc, registered: true } : doc
          )
        );
      }
    } catch (error) {
      console.error("Error registering document:", error);
      toast({
        title: "Registration Error",
        description: "An error occurred while registering the document",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleRemoveDocument = (id: string, preview?: string) => {
    // Clean up preview URL if it exists
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
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
      return <FileText className="h-6 w-6" />;
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
                  <Button variant="default" size="default" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading...
                      </>
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
                    disabled={isUploading}
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveDocument(document.id, document.preview)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRegisterDocument(document)}
                          disabled={isRegistering || !walletConnected}
                        >
                          {isRegistering ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              Registering...
                            </>
                          ) : (
                            "Register on Blockchain"
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {document.preview && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="mt-2 px-0">
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
