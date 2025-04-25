
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { registerDocument, getCurrentWalletAddress } from '@/services/blockchainService';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [transaction, setTransaction] = useState<string | null>(null);

  const uploadToBlockchain = async (file: File): Promise<boolean> => {
    setIsUploading(true);
    try {
      // Check wallet connection
      const walletAddress = await getCurrentWalletAddress();
      if (!walletAddress) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to upload documents",
          variant: "destructive",
        });
        return false;
      }

      // Generate document hash
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const documentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Register document on blockchain
      const timestamp = Math.floor(Date.now() / 1000);
      const tx = await registerDocument(documentHash, file.type, timestamp);
      
      if (tx) {
        setTransaction(tx);
        toast({
          title: "Upload Successful",
          description: "Document has been registered on the blockchain",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error uploading to blockchain:", error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadToBlockchain,
    isUploading,
    transaction
  };
};
