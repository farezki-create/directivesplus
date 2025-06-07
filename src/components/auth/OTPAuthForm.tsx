
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, Key, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const OTPAuthForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('📧 Envoi OTP pour:', email);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log('📧 Réponse send-otp:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Erreur envoi OTP');
      }

      toast({
        title: "Code envoyé !",
        description: "Un code de vérification a été envoyé à votre email.",
      });
      
      setStep('otp');
    } catch (error: any) {
      console.error('❌ Erreur envoi OTP:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔐 Vérification OTP pour:', email, 'Code:', otp);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, otp_code: otp }),
      });

      const result = await response.json();
      console.log('🔐 Réponse verify-otp:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Code OTP invalide');
      }

      if (result.success) {
        toast({
          title: "Connexion réussie !",
          description: "Redirection vers votre espace...",
        });
        
        // Redirection forcée vers /rediger
        setTimeout(() => {
          window.location.href = '/rediger';
        }, 1000);
      }
    } catch (error: any) {
      console.error('❌ Erreur vérification OTP:', error);
      toast({
        title: "Erreur",
        description: error.message || "Code invalide ou expiré.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-directiveplus-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img 
              src="/lovable-uploads/b5d06491-daf5-4c47-84f7-6920d23506ff.png" 
              alt="DirectivesPlus" 
              className="h-16 w-auto mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-bold text-directiveplus-800">
            Connexion par email
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'email' 
              ? "Entrez votre email pour recevoir un code de connexion"
              : "Entrez le code reçu par email"
            }
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center flex items-center justify-center">
              {step === 'otp' && (
                <button
                  onClick={() => setStep('email')}
                  className="mr-2 p-1 hover:bg-gray-100 rounded"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              {step === 'email' ? 'Votre email' : 'Code de vérification'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 'email' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
                  disabled={loading}
                >
                  {loading ? "Envoi en cours..." : "Envoyer le code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="text-sm text-gray-600 text-center mb-4">
                  Code envoyé à : <strong>{email}</strong>
                </div>
                
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10 text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Vérification..." : "Se connecter"}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep('email')}
                  disabled={loading}
                >
                  Renvoyer un code
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Vous préférez la connexion classique ?{' '}
            <Link to="/auth" className="text-directiveplus-600 hover:underline">
              Connexion par mot de passe
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
