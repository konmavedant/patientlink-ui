
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, LogIn, User, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'patient' | 'provider'>('patient');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Demo credentials based on userType
  const demoCredentials = {
    patient: { username: 'patient', password: 'password' },
    provider: { username: 'provider', password: 'password' }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) return;
    
    setIsLoggingIn(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const useDemoCredentials = () => {
    const { username, password } = demoCredentials[userType];
    setUsername(username);
    setPassword(password);
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-white to-medical-lightest">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="h-12 w-12 rounded-xl gradient-blue flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800 mb-2">HealthChain</h1>
          <p className="text-neutral-500 max-w-sm mx-auto">Secure blockchain-based electronic healthcare records</p>
        </div>
        
        <Card className="glass-card shadow-elevation border-neutral-200/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Choose account type and enter your credentials
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs
                defaultValue="patient"
                className="mb-6"
                onValueChange={(value) => setUserType(value as 'patient' | 'provider')}
              >
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="patient">Patient</TabsTrigger>
                  <TabsTrigger value="provider">Healthcare Provider</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full gradient-blue hover:opacity-90 transition-opacity"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <span className="flex items-center">
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign in
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter>
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={useDemoCredentials}
            >
              Use demo credentials ({userType})
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>Blockchain-secured healthcare records</p>
          <p className="mt-1">All data is encrypted and securely stored</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
