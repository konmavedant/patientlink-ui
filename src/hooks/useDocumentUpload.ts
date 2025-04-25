
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { registerDocument, grantAccess, getCurrentWalletAddress } from '@/services/blockchainService';

export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const hashDocument = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const uploadDocument = async (file: File): Promise<{ success: boolean; hash?: string }> => {
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
        return { success: true, hash: documentHash };
      }
      
      return { success: false };
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadDocument, isUploading };
};
