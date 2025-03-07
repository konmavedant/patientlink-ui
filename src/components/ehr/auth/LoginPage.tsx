
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEhrAuth } from '@/contexts/EhrAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, LockKeyhole, AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useEhrAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'patient' | 'provider'>('patient');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loggedInUser = await login(email, password);
    
    // Navigate based on user role
    if (loggedInUser) {
      if (loggedInUser.role === 'patient') {
        navigate('/patient-dashboard');
      } else {
        navigate('/provider-dashboard');
      }
    }
  };

  const handleDemoLogin = async (role: 'patient' | 'provider') => {
    let demoEmail = '';
    let demoPassword = '';

    if (role === 'patient') {
      demoEmail = 'jane.doe@example.com';
      demoPassword = 'patient123';
    } else {
      demoEmail = 'dr.chen@hospital.com';
      demoPassword = 'doctor123';
    }

    setEmail(demoEmail);
    setPassword(demoPassword);
    const loggedInUser = await login(demoEmail, demoPassword);
    
    // Navigate based on user role
    if (loggedInUser) {
      if (loggedInUser.role === 'patient') {
        navigate('/patient-dashboard');
      } else {
        navigate('/provider-dashboard');
      }
    }
  };

  const setDemoCredentials = (role: 'patient' | 'provider') => {
    if (role === 'patient') {
      setEmail('jane.doe@example.com');
      setPassword('patient123');
    } else {
      setEmail('dr.chen@hospital.com');
      setPassword('doctor123');
    }
    setUserType(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <div className="flex items-center p-4 md:p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                <LockKeyhole className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">HealthChain</h1>
            <p className="mt-2 text-muted-foreground">Secure Blockchain-Based EHR System</p>
          </div>

          <Tabs value={userType} onValueChange={(v) => setUserType(v as 'patient' | 'provider')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="provider">Healthcare Provider</TabsTrigger>
            </TabsList>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Access your {userType === 'patient' ? 'medical records' : 'patient data'} securely
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-muted-foreground">
                        <LockKeyhole className="h-4 w-4" />
                      </div>
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-blue text-white hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center w-full">
                  <span className="text-muted-foreground">For demo purposes: </span>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setDemoCredentials('patient')}
                  >
                    Patient Demo
                  </Button>
                  <span className="text-muted-foreground"> or </span>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setDemoCredentials('provider')}
                  >
                    Provider Demo
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
