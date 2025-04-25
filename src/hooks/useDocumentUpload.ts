
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { registerDocument, grantAccess, getCurrentWalletAddress } from '@/services/blockchainService';
import { MedicalRecord } from '@/types/ehr';

export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const hashDocument = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const uploadDocument = async (file: File, patientId?: string, providerId?: string): Promise<{ success: boolean; hash?: string; record?: MedicalRecord }> => {
    setIsUploading(true);
    
    try {
      const walletAddress = await getCurrentWalletAddress();
      if (!walletAddress) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to upload documents",
          variant: "destructive",
        });
        return { success: false };
      }

      // Generate document hash
      const documentHash = await hashDocument(file);
      
      // Register document on blockchain
      const success = await registerDocument(documentHash, file.type);
      
      if (success) {
        // Create a medical record entry
        const newRecord: MedicalRecord = {
          id: crypto.randomUUID(),
          patientId: patientId || "current-patient", // This would be set properly in a real app
          providerId: providerId || "self-upload", // If the patient uploads it themselves
          providerName: providerId ? "Doctor" : "Self Upload",
          type: getRecordTypeFromFileType(file.type),
          title: file.name,
          date: new Date().toISOString(),
          description: `Uploaded document: ${file.name}`,
          details: {
            fileSize: file.size,
            fileType: file.type,
          },
          attachments: [{
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type,
          }],
          blockchainHash: documentHash,
          lastModified: new Date().toISOString(),
        };
        
        return { success: true, hash: documentHash, record: newRecord };
      }
      
      return { success: false };
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  };

  const getRecordTypeFromFileType = (fileType: string): 'imaging' | 'lab' | 'note' => {
    if (fileType.startsWith('image/')) return 'imaging';
    if (fileType === 'application/pdf') return 'lab';
    return 'note';
  };

  return { uploadDocument, isUploading };
};
