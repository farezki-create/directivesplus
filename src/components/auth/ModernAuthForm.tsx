
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, User, Mail, Calendar, MapPin, Phone, Lock } from 'lucide-react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

export const ModernAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    phoneNumber: ''
  });

  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommon: !/(password|123456|qwerty|abc123)/i.test(password)
    };
    
    return Object.values(checks).filter(Boolean).length >= 5;
  };

  const validateForm = () => {
    if (!isLogin) {
      if (!formData.firstName.trim()) {
        setMessage('Le prénom est requis');
        return false;
      }
      if (!formData.lastName.trim()) {
        setMessage('Le nom est requis');
        return false;
      }
      if (!formData.birthDate) {
        setMessage('La date de naissance est requise');
        return false;
      }
      if (!formData.street.trim()) {
        setMessage('L\'adresse est requise');
        return false;
      }
      if (!formData.city.trim()) {
        setMessage('La ville est requise');
        return false;
      }
      if (!formData.postalCode.trim()) {
        setMessage('Le code postal est requis');
        return false;
      }
      if (!formData.phoneNumber.trim()) {
        setMessage('Le numéro de téléphone est requis');
        return false;
      }
      if (!validatePassword(formData.password)) {
        setMessage('Le mot de passe ne respecte pas les critères de sécurité');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage('Les mots de passe ne correspondent pas');
        return false;
      }
    }
    return true;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        setMessage('Connexion réussie !');
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/rediger`,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              birth_date: formData.birthDate,
              street: formData.street,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.country,
              phone_number: formData.phoneNumber
            }
          }
        });
        
        if (error) throw error;
        setMessage('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
      }
    } catch (error: any) {
      setMessage(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isLogin ? 'Bienvenue' : 'Créer un compte'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isLogin ? 'Connectez-vous à votre compte' : 'Rejoignez-nous en quelques étapes'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {message && (
            <Alert className={`${message.includes('réussie') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <AlertDescription className={message.includes('réussie') ? 'text-green-800' : 'text-red-800'}>
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Prénom *
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      required={!isLogin}
                      disabled={loading}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nom *
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      required={!isLogin}
                      disabled={loading}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date de naissance *
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    required={!isLogin}
                    disabled={loading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Adresse *
                  </Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleChange('street', e.target.value)}
                    placeholder="Numéro et nom de rue"
                    required={!isLogin}
                    disabled={loading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      Ville *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      required={!isLogin}
                      disabled={loading}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-sm font-medium">
                      Code postal *
                    </Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleChange('postalCode', e.target.value)}
                      placeholder="75000"
                      required={!isLogin}
                      disabled={loading}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Numéro de téléphone *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    placeholder="0123456789"
                    required={!isLogin}
                    disabled={loading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                disabled={loading}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mot de passe *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  disabled={loading}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!isLogin && <PasswordStrengthMeter password={formData.password} />}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirmer le mot de passe *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required={!isLogin}
                    disabled={loading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  firstName: '',
                  lastName: '',
                  birthDate: '',
                  street: '',
                  city: '',
                  postalCode: '',
                  country: 'France',
                  phoneNumber: ''
                });
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
              disabled={loading}
            >
              {isLogin ? "Pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
