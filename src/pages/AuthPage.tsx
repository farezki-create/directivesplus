
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, Calendar, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const countryCodes = [
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+32", country: "Belgique", flag: "🇧🇪" },
  { code: "+41", country: "Suisse", flag: "🇨🇭" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "Royaume-Uni", flag: "🇬🇧" },
  { code: "+49", country: "Allemagne", flag: "🇩🇪" },
  { code: "+39", country: "Italie", flag: "🇮🇹" },
  { code: "+34", country: "Espagne", flag: "🇪🇸" },
];

const AuthPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États pour la connexion
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // États pour l'inscription
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    countryCode: "+33",
    phoneNumber: "",
  });

  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/rediger');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("🔐 Tentative de connexion pour:", loginEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      if (data.user) {
        console.log("✅ Connexion réussie:", data.user.id);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        navigate('/rediger');
      }
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      setError(error.message || 'Erreur lors de la connexion');
      toast({
        title: "Erreur de connexion",
        description: error.message || 'Vérifiez vos identifiants',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePhoneNumber = (phone: string) => {
    // Supprime tous les caractères non numériques
    const cleanPhone = phone.replace(/\D/g, '');
    // Vérifie que c'est entre 8 et 15 chiffres
    return cleanPhone.length >= 8 && cleanPhone.length <= 15;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    if (!registerData.phoneNumber.trim()) {
      setError("Le numéro de téléphone est obligatoire");
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(registerData.phoneNumber)) {
      setError("Le numéro de téléphone doit contenir entre 8 et 15 chiffres");
      setLoading(false);
      return;
    }

    const fullPhoneNumber = registerData.countryCode + registerData.phoneNumber.replace(/\D/g, '');
    console.log("📞 Numéro de téléphone complet:", fullPhoneNumber);

    try {
      console.log("📝 Tentative d'inscription pour:", registerData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            first_name: registerData.firstName,
            last_name: registerData.lastName,
            birth_date: registerData.birthDate,
            phone_number: fullPhoneNumber,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        console.log("✅ Inscription réussie:", data.user.id);
        
        // Envoyer email de confirmation via Resend
        try {
          console.log("📧 Envoi de l'email de confirmation via Resend");
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-auth-email', {
            body: {
              email: registerData.email,
              type: 'confirmation',
              token: data.user.id,
              firstName: registerData.firstName,
              lastName: registerData.lastName
            }
          });

          if (emailError) {
            console.error("❌ Erreur envoi email:", emailError);
            throw emailError;
          }

          console.log("✅ Email de confirmation envoyé via Resend");
        } catch (emailErr) {
          console.warn("⚠️ Erreur envoi email, mais inscription réussie:", emailErr);
        }

        // Envoyer SMS de bienvenue via Twilio
        try {
          console.log("📱 Envoi du SMS de bienvenue via Twilio");
          const { data: smsData, error: smsError } = await supabase.functions.invoke('send-twilio-sms', {
            body: {
              phoneNumber: fullPhoneNumber,
              userId: data.user.id
            }
          });

          if (smsError) {
            console.error("❌ Erreur envoi SMS:", smsError);
            throw smsError;
          }

          console.log("✅ SMS de bienvenue envoyé via Twilio");
        } catch (smsErr) {
          console.warn("⚠️ Erreur envoi SMS, mais inscription réussie:", smsErr);
        }

        toast({
          title: "Inscription réussie",
          description: "Un email de confirmation et un SMS de bienvenue ont été envoyés.",
        });
        
        // Basculer vers l'onglet de connexion
        setActiveTab("login");
        setLoginEmail(registerData.email);
      }
    } catch (error: any) {
      console.error('❌ Erreur d\'inscription:', error);
      setError(error.message || 'Erreur lors de l\'inscription');
      toast({
        title: "Erreur d'inscription",
        description: error.message || 'Erreur lors de la création du compte',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre email pour réinitialiser le mot de passe",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Un lien de réinitialisation a été envoyé à votre email",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || 'Erreur lors de l\'envoi de l\'email',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            ← Retour à l'accueil
          </Button>

          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                DirectivesPlus
              </CardTitle>
              <CardDescription className="text-gray-600">
                Accédez à votre espace personnel sécurisé
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger value="register" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Inscription
                  </TabsTrigger>
                </TabsList>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="votre@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connexion...
                        </>
                      ) : (
                        'Se connecter'
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="link"
                      onClick={handleForgotPassword}
                      className="w-full text-sm"
                    >
                      Mot de passe oublié ?
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstName">Prénom *</Label>
                        <Input
                          id="register-firstName"
                          placeholder="Prénom"
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData({
                            ...registerData,
                            firstName: e.target.value
                          })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-lastName">Nom *</Label>
                        <Input
                          id="register-lastName"
                          placeholder="Nom"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData({
                            ...registerData,
                            lastName: e.target.value
                          })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-birthDate">Date de naissance *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-birthDate"
                          type="date"
                          value={registerData.birthDate}
                          onChange={(e) => setRegisterData({
                            ...registerData,
                            birthDate: e.target.value
                          })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="votre@email.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({
                            ...registerData,
                            email: e.target.value
                          })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-phone">Téléphone *</Label>
                      <div className="flex gap-2">
                        <Select
                          value={registerData.countryCode}
                          onValueChange={(value) => setRegisterData({
                            ...registerData,
                            countryCode: value
                          })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <span className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span>{country.code}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-phone"
                            type="tel"
                            placeholder="123456789"
                            value={registerData.phoneNumber}
                            onChange={(e) => {
                              // Permet seulement les chiffres, espaces, tirets et parenthèses
                              const value = e.target.value.replace(/[^\d\s\-\(\)]/g, '');
                              setRegisterData({
                                ...registerData,
                                phoneNumber: value
                              });
                            }}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Format: {registerData.countryCode}123456789
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Mot de passe *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({
                            ...registerData,
                            password: e.target.value
                          })}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">Minimum 8 caractères</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirmPassword">Confirmer le mot de passe *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="register-confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value
                          })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Inscription...
                        </>
                      ) : (
                        'S\'inscrire'
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      * Champs obligatoires
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Vos données sont protégées et chiffrées</p>
            <p>Conforme RGPD • Hébergement sécurisé en France</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
