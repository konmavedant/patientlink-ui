
import { toast } from "@/components/ui/use-toast";

// Contract information for the deployed MedicalDocumentRegistry
export const CONTRACT_INFO = {
  address: "0x4c67a87a40f0c0b9b1e54debb78fc9a59f21e0b7",
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "documentHash",
          "type": "string"
        }
      ],
      "name": "AccessGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "documentHash",
          "type": "string"
        }
      ],
      "name": "AccessRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "documentHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "DocumentRegistered",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "documentHash",
          "type": "string"
        }
      ],
      "name": "grantAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "documentHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "documentType",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "registerDocument",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "documentHash",
          "type": "string"
        }
      ],
      "name": "revokeAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "patient",
          "type": "address"
        }
      ],
      "name": "getAccessibleDocuments",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "documentHash",
          "type": "string"
        }
      ],
      "name": "getDocumentDetails",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "documentHash",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "documentType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "exists",
              "type": "bool"
            }
          ],
          "internalType": "struct MedicalDocumentRegistry.Document",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "patient",
          "type": "address"
        }
      ],
      "name": "getPatientDocuments",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "patient",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "documentHash",
          "type": "string"
        }
      ],
      "name": "hasAccess",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
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
