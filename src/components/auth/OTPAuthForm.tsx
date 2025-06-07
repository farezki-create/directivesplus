
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useSearchParams } from 'react-router-dom';
import { cleanupAuthState } from '@/utils/authCleanup';

export const OTPAuthForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(''); // Pas de valeur par défaut
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Nettoyer complètement au montage
  useEffect(() => {
    console.log('🧹 Complete auth cleanup on component mount');
    cleanupAuthState();
  }, []);

  // Pré-remplir l'email depuis l'URL seulement si explicitement fourni
  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl && emailFromUrl.trim()) {
      const decodedEmail = decodeURIComponent(emailFromUrl);
      console.log('📧 Email from URL:', decodedEmail);
      setEmail(decodedEmail);
    }
  }, [searchParams]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendOtp = async () => {
    const targetEmail = email.trim();
    
    if (!targetEmail) {
      setError('Veuillez entrer votre email');
      return;
    }

    if (!validateEmail(targetEmail)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('📧 Sending OTP to manually entered email:', targetEmail);
      
      const response = await fetch('https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/send-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dHFxam5lY2V6a3h5aG1tanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxOTc5MjUsImV4cCI6MjA1Mjc3MzkyNX0.uocoNg-le-iv0pw7c99mthQ6gxGHyXGyQqgxo9_3CPc`
        },
        body: JSON.stringify({ email: targetEmail }),
      });

      console.log('📧 Send OTP response status:', response.status);
      
      const responseText = await response.text();
      console.log('📧 Send OTP response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        throw new Error(`Invalid server response: ${response.status}`);
      }

      if (!response.ok) {
        console.error('❌ HTTP error:', response.status, data);
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      if (data.success) {
        console.log('✅ OTP sent successfully');
        setStep('otp');
        setMessage(`Code envoyé à ${targetEmail}. Vérifiez votre boîte de réception et vos spams.`);
      } else {
        console.error('❌ Send OTP failed:', data);
        setError(data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (err) {
      console.error('💥 Send OTP error:', err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Veuillez entrer un code à 6 chiffres');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('Le code doit contenir uniquement des chiffres');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('🔍 Verifying OTP for email:', email, 'code:', otp);
      
      const response = await fetch('https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/verify-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dHFxam5lY2V6a3h5aG1tanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxOTc5MjUsImV4cCI6MjA1Mjc3MzkyNX0.uocoNg-le-iv0pw7c99mthQ6gxGHyXGyQqgxo9_3CPc`
        },
        body: JSON.stringify({ email, otp_code: otp }),
      });

      console.log('🔍 Verify OTP response status:', response.status);
      
      const responseText = await response.text();
      console.log('🔍 Verify OTP response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse verify response:', parseError);
        throw new Error(`Invalid server response: ${response.status}`);
      }

      if (!response.ok) {
        console.error('❌ Verify HTTP error:', response.status, data);
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      if (data.success) {
        console.log('✅ OTP verification successful');
        setMessage('Connexion réussie ! Redirection en cours...');
        
        if (data.auth_url) {
          console.log('🔗 Redirecting to auth URL:', data.auth_url);
          setTimeout(() => {
            window.location.href = data.auth_url;
          }, 1000);
        } else {
          console.log('🔗 No auth URL, redirecting to /rediger');
          setTimeout(() => {
            window.location.href = '/rediger';
          }, 2000);
        }
      } else {
        console.error('❌ OTP verification failed:', data);
        setError(data.message || 'Code invalide ou expiré');
      }
    } catch (err) {
      console.error('💥 Verify OTP error:', err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setMessage('');
    setError('');
    cleanupAuthState();
  };

  const resendCode = () => {
    setOtp('');
    setError('');
    setMessage('');
    sendOtp();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Connexion par code email
          </CardTitle>
          <CardDescription className="text-gray-600">
            {step === 'email' 
              ? 'Entrez votre email pour recevoir un code de connexion'
              : 'Entrez le code reçu par email'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {message && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {step === 'email' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Adresse email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  disabled={loading}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendOtp()}
                />
              </div>
              
              <Button 
                onClick={sendOtp}
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer le code
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Code de vérification
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Code envoyé à {email}
                </p>
              </div>
              
              <Button 
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Vérifier le code
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1"
                >
                  Changer d'email
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resendCode}
                  disabled={loading}
                  className="flex-1"
                >
                  Renvoyer le code
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Le code est valable 10 minutes</p>
            <p>Vérifiez vos spams si vous ne recevez pas l'email</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
