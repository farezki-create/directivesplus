
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';

interface OTPAuthFormProps {
  onSuccess?: () => void;
}

export const OTPAuthForm: React.FC<OTPAuthFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: email.trim() }
      });

      if (error) {
        throw new Error(error.message || 'Erreur lors de l\'envoi du code');
      }

      if (data?.success) {
        setStep('otp');
        setMessage('Un code de vérification a été envoyé à votre adresse email');
      } else {
        throw new Error(data?.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (err: any) {
      console.error('Erreur envoi OTP:', err);
      setError(err.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length !== 6) {
      setError('Veuillez saisir un code à 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          email: email.trim(),
          otp_code: otpCode.trim()
        }
      });

      if (error) {
        throw new Error(error.message || 'Erreur lors de la vérification du code');
      }

      if (data?.success && data?.auth_url) {
        // Extraire les tokens de l'URL d'authentification
        const url = new URL(data.auth_url);
        const accessToken = url.searchParams.get('access_token');
        const refreshToken = url.searchParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // Définir la session avec les tokens reçus
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            throw new Error('Erreur lors de la connexion');
          }

          setMessage('Connexion réussie !');
          
          // Appeler le callback de succès après un délai court
          setTimeout(() => {
            onSuccess?.();
          }, 1000);
        } else {
          throw new Error('Tokens d\'authentification manquants');
        }
      } else {
        throw new Error(data?.message || 'Code de vérification invalide');
      }
    } catch (err: any) {
      console.error('Erreur vérification OTP:', err);
      setError(err.message || 'Code de vérification invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('email');
    setOtpCode('');
    setError('');
    setMessage('');
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: email.trim() }
      });

      if (error) {
        throw new Error(error.message || 'Erreur lors de l\'envoi du code');
      }

      if (data?.success) {
        setMessage('Un nouveau code a été envoyé à votre adresse email');
      } else {
        throw new Error(data?.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (err: any) {
      console.error('Erreur renvoi OTP:', err);
      setError(err.message || 'Erreur lors du renvoi du code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {step === 'email' ? 'Connexion par email' : 'Vérification'}
        </CardTitle>
        <CardDescription>
          {step === 'email' 
            ? 'Saisissez votre adresse email pour recevoir un code de connexion'
            : `Code envoyé à ${email}`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {message && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer le code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otpCode" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Code de vérification
              </Label>
              <Input
                id="otpCode"
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                disabled={loading}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 text-center">
                Saisissez le code à 6 chiffres reçu par email
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Vérifier et se connecter
            </Button>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="link"
                onClick={handleResendCode}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Renvoyer le code
              </Button>
              
              <Button
                type="button"
                variant="link"
                onClick={handleBack}
                disabled={loading}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Modifier l'adresse email
              </Button>
            </div>
          </form>
        )}

        <div className="text-xs text-gray-500 text-center">
          Le code de vérification expire au bout de 10 minutes
        </div>
      </CardContent>
    </Card>
  );
};
