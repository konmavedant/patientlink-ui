
import { ethers } from "ethers";
import { toast } from "@/components/ui/use-toast";

// This will be replaced with actual contract address and ABI
const DOCUMENT_REGISTRY_CONTRACT = {
  address: "0x0000000000000000000000000000000000000000", // Placeholder - will be replaced with actual deployed contract
  abi: [
    // Placeholder ABI - will be replaced with actual contract ABI
    "function registerDocument(string memory documentHash, string memory documentType, uint256 timestamp) external",
    "function grantAccess(address provider, string memory documentHash) external",
    "function revokeAccess(address provider, string memory documentHash) external",
    "function hasAccess(address provider, address patient, string memory documentHash) external view returns (bool)",
    "function getPatientDocuments(address patient) external view returns (string[] memory)",
    "function getAccessibleDocuments(address provider, address patient) external view returns (string[] memory)"
  ]
};

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
      DOCUMENT_REGISTRY_CONTRACT.address,
      DOCUMENT_REGISTRY_CONTRACT.abi,
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

export const registerDocument = async (documentHash: string, documentType: string) => {
  const connection = await connectToContract();
  if (!connection) return false;
  
  const { contract } = connection;
  
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const tx = await contract.registerDocument(documentHash, documentType, timestamp);
    await tx.wait();
    
    toast({
      title: "Document Registered",
      description: "Your document has been securely registered on the blockchain",
    });
    return true;
  } catch (error) {
    console.error("Error registering document:", error);
    toast({
      title: "Registration Failed",
      description: "Failed to register document on blockchain",
      variant: "destructive",
    });
    return false;
  }
};

export const grantAccess = async (providerAddress: string, documentHash: string) => {
  const connection = await connectToContract();
  if (!connection) return false;
  
  const { contract } = connection;
  
  try {
    const tx = await contract.grantAccess(providerAddress, documentHash);
    await tx.wait();
    
    toast({
      title: "Access Granted",
      description: "Provider has been granted access to this document",
    });
    return true;
  } catch (error) {
    console.error("Error granting access:", error);
    toast({
      title: "Action Failed",
      description: "Failed to grant access to provider",
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
    const tx = await contract.revokeAccess(providerAddress, documentHash);
    await tx.wait();
    
    toast({
      title: "Access Revoked",
      description: "Provider access has been revoked",
    });
    return true;
  } catch (error) {
    console.error("Error revoking access:", error);
    toast({
      title: "Action Failed",
      description: "Failed to revoke provider access",
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
    const hasAccess = await contract.hasAccess(providerAddress, patientAddress, documentHash);
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
    const documents = await contract.getPatientDocuments(patientAddress);
    return documents;
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
    const documents = await contract.getAccessibleDocuments(providerAddress, patientAddress);
    return documents;
  } catch (error) {
    console.error("Error fetching accessible documents:", error);
    return [];
  }
};
