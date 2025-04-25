
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { WalletIcon, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { CONTRACT_INFO } from "@/services/contractHelper";

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  // Check for existing wallet connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ 
            method: "eth_accounts" 
          });
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            
            // Check network
            const currentChainId = await window.ethereum.request({ 
              method: "eth_chainId" 
            });
            setChainId(currentChainId);
            
            // Sepolia chain ID is 0xaa36a7 (11155111 in decimal)
            setIsCorrectNetwork(currentChainId === "0xaa36a7");
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          toast({
            title: "Wallet Connected",
            description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
        } else {
          setAccount(null);
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
            variant: "destructive",
          });
        }
      });
      
      // Listen for chain changes
      window.ethereum.on("chainChanged", (chainId: string) => {
        setChainId(chainId);
        // Sepolia chain ID is 0xaa36a7 (11155111 in decimal)
        const correctNetwork = chainId === "0xaa36a7";
        setIsCorrectNetwork(correctNetwork);
        
        if (correctNetwork) {
          toast({
            title: "Network Changed",
            description: "Connected to Sepolia Testnet",
          });
        } else {
          toast({
            title: "Wrong Network",
            description: "Please connect to Sepolia Testnet",
            variant: "destructive",
          });
        }
      });
    }
    
    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const accounts = await window.ethereum.request({ 
          method: "eth_requestAccounts" 
        });
        
        setAccount(accounts[0]);
        
        // Check network after connecting
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        setChainId(chainId);
        
        // Sepolia chain ID is 0xaa36a7 (11155111 in decimal)
        const isCorrect = chainId === "0xaa36a7";
        setIsCorrectNetwork(isCorrect);
        
        if (!isCorrect) {
          toast({
            title: "Wrong Network",
            description: "Please switch to Sepolia Testnet",
            variant: "destructive",
          });
          // Prompt to switch networks
          switchToSepolia();
        } else {
          toast({
            title: "Wallet Connected",
            description: `Successfully connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to your wallet",
          variant: "destructive",
        });
      } finally {
        setIsConnecting(false);
      }
    } else {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use this feature",
        variant: "destructive",
      });
    }
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) return;
    
    try {
      // Try to switch to Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia's chain ID in hex
      });
    } catch (error: any) {
      // If network doesn't exist in wallet, try to add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding Sepolia network:", addError);
        }
      }
      console.error("Error switching to Sepolia:", error);
    }
  };

  const viewOnEtherscan = () => {
    if (account) {
      window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank');
    }
  };
  
  const viewContract = () => {
    window.open(`https://sepolia.etherscan.io/address/${CONTRACT_INFO.address}`, '_blank');
  };

  if (!account) {
    return (
      <Button 
        variant="outline" 
        onClick={connectWallet} 
        className="flex items-center gap-2"
        disabled={isConnecting}
      >
        <WalletIcon className="h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isCorrectNetwork && (
        <Button 
          variant="destructive" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={switchToSepolia}
        >
          Switch to Sepolia
        </Button>
      )}
      <div className="flex flex-col items-end">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={viewOnEtherscan}
        >
          <WalletIcon className="h-4 w-4" />
          {`${account.slice(0, 6)}...${account.slice(-4)}`}
          <ExternalLink className="h-3 w-3" />
        </Button>
        <Button
          variant="link"
          size="sm"
          className="text-xs p-0 h-auto mt-1"
          onClick={viewContract}
        >
          View Contract
        </Button>
      </div>
    </div>
  );
};

export default ConnectWallet;
