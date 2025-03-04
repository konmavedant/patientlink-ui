
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEhrAuth } from "@/contexts/EhrAuthContext";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useEhrAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the actual email format from mockEhrData
      let email = "";
      
      // Map username to the correct email format
      if (username === "patient") {
        email = "jane.doe@example.com";
      } else if (username === "doctor") {
        email = "dr.chen@hospital.com";
      } else {
        // If they enter an actual email, use that
        email = username;
      }
      
      await login(email, password === "password" ? (username === "patient" ? "patient123" : "doctor123") : password);
      
      // Check user role and redirect accordingly
      if (username === "patient" || email.includes("@example.com")) {
        toast({
          title: "Login successful",
          description: "Welcome to your Patient Dashboard",
        });
        navigate("/patient-dashboard");
      } else {
        toast({
          title: "Login successful",
          description: "Welcome to your Provider Dashboard",
        });
        navigate("/provider-dashboard");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Try 'patient' or 'doctor' with password 'password'",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">MedChain EHR</CardTitle>
          <CardDescription>
            Secure blockchain-based Electronic Health Records
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="patient or doctor" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use 'patient' or 'doctor' with password 'password'
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Index;
