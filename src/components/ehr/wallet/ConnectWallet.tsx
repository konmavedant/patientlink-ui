
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { WalletIcon, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

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
    }
    
    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
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
        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
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

  const viewOnEtherscan = () => {
    if (account) {
      window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank');
    }
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
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={viewOnEtherscan}
      >
        <WalletIcon className="h-4 w-4" />
        {`${account.slice(0, 6)}...${account.slice(-4)}`}
        <ExternalLink className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ConnectWallet;
