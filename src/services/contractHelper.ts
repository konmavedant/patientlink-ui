
import { toast } from "@/components/ui/use-toast";

// This file will be updated after contract deployment with the actual address and ABI
export const CONTRACT_INFO = {
  address: "0x0000000000000000000000000000000000000000", // Will be replaced with actual address after deployment
  // ABI will be updated with the complete ABI after contract deployment
  abi: [
    "function registerDocument(string memory documentHash, string memory documentType, uint256 timestamp) external",
    "function grantAccess(address provider, string memory documentHash) external",
    "function revokeAccess(address provider, string memory documentHash) external",
    "function hasAccess(address provider, address patient, string memory documentHash) external view returns (bool)",
    "function getPatientDocuments(address patient) external view returns (string[] memory)",
    "function getDocumentDetails(string memory documentHash) external view returns (tuple(string documentHash, string documentType, uint256 timestamp, bool exists) memory)",
    "function getAccessibleDocuments(address provider, address patient) external view returns (string[] memory)"
  ]
};

/**
 * Update this function with the actual deployed contract address and ABI
 * Call this after contract deployment
 */
export const updateContractInfo = (address: string, abi: any[]) => {
  // In a real app, this would persist the contract info
  // For now, we'll just show a toast to simulate the update
  toast({
    title: "Contract Connected",
    description: `Connected to contract at ${address.slice(0, 6)}...${address.slice(-4)}`,
  });
  
  console.log("Contract address and ABI updated", { address, abi });
};

/**
 * Helper instructions for deploying the contract
 */
export const getDeploymentInstructions = () => {
  return `
    # Medical Document Registry Smart Contract Deployment
    
    Follow these steps to deploy the smart contract:
    
    1. **Compile the contract** using Remix, Hardhat, or Truffle
    
    2. **Deploy to Sepolia Testnet** using MetaMask with test ETH
       - Network: Sepolia Testnet
       - Gas Limit: 5000000
       - Make sure you have test ETH (get from a Sepolia faucet)
    
    3. **Verify the contract** on Etherscan for easier interaction
    
    4. **Update the contractHelper.ts file** with:
       - The deployed contract address
       - The full contract ABI
    
    For testing on local network, you can use Hardhat or Ganache.
  `;
};
