import { ethers } from "ethers";
import { toast } from "@/components/ui/use-toast";
import { CONTRACT_INFO } from "./contractHelper";

export const connectToContract = async () => {
  if (!window.ethereum) {
    toast({
      title: "MetaMask Not Found",
      description: "Please install MetaMask to interact with the blockchain",
      variant: "destructive",
    });
    return null;
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT_INFO.address,
      CONTRACT_INFO.abi,
      signer
    );
    return { contract, signer };
  } catch (error) {
    console.error("Error connecting to contract:", error);
    toast({
      title: "Connection Error",
      description: "Failed to connect to the blockchain",
      variant: "destructive",
    });
    return null;
  }
};

export const registerDocument = async (documentHash: string, documentType: string, timestamp: number) => {
  const connection = await connectToContract();
  if (!connection) return null;
  
  const { contract } = connection;
  
  try {
    console.log(`Registering document with hash ${documentHash}, type ${documentType}, timestamp ${timestamp}`);
    const tx = await contract.registerDocument(documentHash, documentType, timestamp);
    console.log("Transaction hash:", tx.hash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed, receipt:", receipt);
    
    toast({
      title: "Document Registered",
      description: "Your document has been securely registered on the blockchain",
    });
    return tx.hash;
  } catch (error) {
    console.error("Error registering document:", error);
    toast({
      title: "Registration Failed",
      description: `Failed to register document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
    return null;
  }
};

export const grantAccess = async (providerAddress: string, documentHash: string) => {
  const connection = await connectToContract();
  if (!connection) return false;
  
  const { contract } = connection;
  
  try {
    console.log(`Granting access to provider ${providerAddress} for document ${documentHash}`);
    const tx = await contract.grantAccess(providerAddress, documentHash);
    console.log("Transaction hash:", tx.hash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed, receipt:", receipt);
    
    toast({
      title: "Access Granted",
      description: "Provider has been granted access to this document",
    });
    return true;
  } catch (error) {
    console.error("Error granting access:", error);
    toast({
      title: "Action Failed",
      description: `Failed to grant access: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
    return false;
  }
};

export const revokeAccess = async (providerAddress: string, documentHash: string) => {
  const connection = await connectToContract();
  if (!connection) return false;
  
  const { contract } = connection;
  
  try {
    console.log(`Revoking access from provider ${providerAddress} for document ${documentHash}`);
    const tx = await contract.revokeAccess(providerAddress, documentHash);
    console.log("Transaction hash:", tx.hash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Transaction confirmed, receipt:", receipt);
    
    toast({
      title: "Access Revoked",
      description: "Provider access has been revoked",
    });
    return true;
  } catch (error) {
    console.error("Error revoking access:", error);
    toast({
      title: "Action Failed",
      description: `Failed to revoke access: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive",
    });
    return false;
  }
};

export const checkAccess = async (providerAddress: string, patientAddress: string, documentHash: string) => {
  const connection = await connectToContract();
  if (!connection) return false;
  
  const { contract } = connection;
  
  try {
    console.log(`Checking if provider ${providerAddress} has access to document ${documentHash} from patient ${patientAddress}`);
    const hasAccess = await contract.hasAccess(providerAddress, patientAddress, documentHash);
    console.log("Access status:", hasAccess);
    return hasAccess;
  } catch (error) {
    console.error("Error checking access:", error);
    return false;
  }
};

export const getPatientDocuments = async (patientAddress: string) => {
  const connection = await connectToContract();
  if (!connection) return [];
  
  const { contract } = connection;
  
  try {
    console.log(`Getting documents for patient ${patientAddress}`);
    const documents = await contract.getPatientDocuments(patientAddress);
    console.log("Patient documents:", documents);
    
    const documentDetails = await Promise.all(
      documents.map(async (hash: string) => {
        const details = await contract.getDocumentDetails(hash);
        return {
          documentHash: details[0],
          documentType: details[1],
          timestamp: Number(details[2]),
          exists: details[3]
        };
      })
    );
    console.log("Document details:", documentDetails);
    return documentDetails;
  } catch (error) {
    console.error("Error fetching patient documents:", error);
    return [];
  }
};

export const getAccessibleDocuments = async (providerAddress: string, patientAddress: string) => {
  const connection = await connectToContract();
  if (!connection) return [];
  
  const { contract } = connection;
  
  try {
    console.log(`Getting accessible documents for provider ${providerAddress} from patient ${patientAddress}`);
    const documents = await contract.getAccessibleDocuments(providerAddress, patientAddress);
    console.log("Accessible documents:", documents);
    
    // Get details for each document
    const documentDetails = await Promise.all(
      documents.map(async (hash: string) => {
        try {
          const details = await contract.getDocumentDetails(hash);
          return {
            documentHash: details[0],
            documentType: details[1],
            timestamp: Number(details[2]),
            exists: details[3]
          };
        } catch (err) {
          console.error(`Error fetching details for document ${hash}:`, err);
          return null;
        }
      })
    );
    
    // Filter out null entries (failed fetches)
    return documentDetails.filter(Boolean);
  } catch (error) {
    console.error("Error fetching accessible documents:", error);
    return [];
  }
};

export const getDocumentDetails = async (documentHash: string) => {
  const connection = await connectToContract();
  if (!connection) return null;
  
  const { contract } = connection;
  
  try {
    console.log(`Getting details for document ${documentHash}`);
    const details = await contract.getDocumentDetails(documentHash);
    console.log("Document details:", details);
    
    return {
      documentHash: details[0],
      documentType: details[1],
      timestamp: Number(details[2]),
      exists: details[3]
    };
  } catch (error) {
    console.error("Error fetching document details:", error);
    return null;
  }
};

export const getCurrentWalletAddress = async () => {
  if (!window.ethereum) return null;
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      return accounts[0];
    }
    return null;
  } catch (error) {
    console.error("Error getting wallet address:", error);
    return null;
  }
};
