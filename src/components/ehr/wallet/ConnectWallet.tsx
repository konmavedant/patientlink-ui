
import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ 
          method: "eth_requestAccounts" 
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={connectWallet} 
      className="flex items-center gap-2"
    >
      <WalletIcon className="h-4 w-4" />
      {account 
        ? `${account.slice(0, 6)}...${account.slice(-4)}` 
        : "Connect Wallet"}
    </Button>
  );
};

export default ConnectWallet;
