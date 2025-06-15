
import React, { useState } from 'react';
import { useAdaptiveRateLimit } from '@/hooks/useAdaptiveRateLimit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Clock } from 'lucide-react';

const EnhancedLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    isBlocked,
    remainingRequests,
    resetTime,
    currentLimit,
    checkRateLimit,
    recordError,
    recordSuccess
  } = useAdaptiveRateLimit('/api/auth/login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limit before processing
    const isAllowed = await checkRateLimit(email);
    if (!isAllowed) {
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      // Simulate login logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Record successful response
      const responseTime = Date.now() - startTime;
      recordSuccess(responseTime);
      
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
      recordError();
    } finally {
      setIsLoading(false);
    }
  };

  const getResetTimeString = () => {
    if (!resetTime) return '';
    const minutes = Math.ceil((resetTime - Date.now()) / 1000 / 60);
    return `${minutes} minute(s)`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Connexion Sécurisée
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isBlocked && (
          <Alert variant="destructive">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Trop de tentatives de connexion. Réessayez dans {getResetTimeString()}.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
          <div className="flex justify-between">
            <span>Tentatives restantes:</span>
            <span className="font-medium">{remainingRequests}/{currentLimit}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              disabled={isBlocked || isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isBlocked || isLoading}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isBlocked || isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedLoginForm;
