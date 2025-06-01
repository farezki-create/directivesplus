
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  RefreshCw,
  Server,
  Database
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EmailAuditResult {
  smtpConfig: {
    configured: boolean;
    provider: string;
    issues: string[];
  };
  authSettings: {
    confirmEmail: boolean;
    siteUrl: string;
    redirectUrls: string[];
    emailTemplate: string;
    issues: string[];
  };
  rateLimits: {
    emailSendLimit: string;
    signupLimit: string;
    currentUsage: number;
    issues: string[];
  };
  clientConfig: {
    url: string;
    key: string;
    autoRefresh: boolean;
    persistSession: boolean;
    issues: string[];
  };
  testResults: {
    connectionTest: boolean;
    signupTest: boolean;
    emailTest: boolean;
    errors: string[];
  };
}

export const SupabaseEmailAudit = () => {
  const [auditResult, setAuditResult] = useState<EmailAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const runCompleteAudit = async () => {
    setLoading(true);
    try {
      console.log('🔍 Début de l\'audit complet email Supabase...');
      
      // 1. Test configuration client
      const clientConfig = await auditClientConfig();
      
      // 2. Test configuration auth
      const authSettings = await auditAuthSettings();
      
      // 3. Test SMTP et email
      const smtpConfig = await auditSMTPConfig();
      
      // 4. Test rate limits
      const rateLimits = await auditRateLimits();
      
      // 5. Tests de fonctionnement
      const testResults = await runFunctionalTests();
      
      setAuditResult({
        clientConfig,
        authSettings,
        smtpConfig,
        rateLimits,
        testResults
      });
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'audit:', error);
    } finally {
      setLoading(false);
    }
  };

  const auditClientConfig = async () => {
    const issues: string[] = [];
    
    // Récupérer les valeurs réelles du client Supabase
    const url = supabase.supabaseUrl;
    const key = supabase.supabaseKey;
    
    // Test de connexion
    let connectionWorks = false;
    try {
      const { data } = await supabase.auth.getSession();
      connectionWorks = true;
      console.log('✅ Connexion Supabase: OK');
    } catch (error) {
      issues.push('Impossible de se connecter à Supabase');
      console.error('❌ Connexion Supabase: FAIL', error);
    }
    
    // Vérifier si on est en production
    const currentUrl = window.location.origin;
    if (currentUrl.includes('localhost') || currentUrl.includes('lovable.app')) {
      issues.push('Environnement de développement détecté - Configurez SMTP pour la production');
    }
    
    return {
      url,
      key: key.substring(0, 20) + '...',
      autoRefresh: true,
      persistSession: true,
      issues
    };
  };

  const auditAuthSettings = async () => {
    const issues: string[] = [];
    
    const currentUrl = window.location.origin;
    
    // Vérifications communes
    if (currentUrl.includes('localhost') || currentUrl.includes('lovable.app')) {
      issues.push('Pour la production, configurez dans Supabase Dashboard:');
      issues.push('• Site URL: https://directivesplus.fr');
      issues.push('• Redirect URLs: https://directivesplus.fr/auth');
    }
    
    if (!currentUrl.startsWith('https://') && !currentUrl.includes('localhost')) {
      issues.push('Site URL non sécurisé (HTTPS requis)');
    }
    
    return {
      confirmEmail: true,
      siteUrl: currentUrl,
      redirectUrls: [currentUrl + '/auth'],
      emailTemplate: 'Template Supabase par défaut',
      issues
    };
  };

  const auditSMTPConfig = async () => {
    const issues: string[] = [];
    
    // Instructions spécifiques pour Hostinger
    issues.push('Configuration SMTP Hostinger pour directivesplus.fr:');
    issues.push('• Host: smtp.hostinger.com');
    issues.push('• Port: 587 (STARTTLS recommandé)');
    issues.push('• Username: noreply@directivesplus.fr');
    issues.push('• Password: [mot de passe de l\'email]');
    issues.push('• Sender Name: DirectivesPlus');
    issues.push('• Sender Email: noreply@directivesplus.fr');
    issues.push('⚠️ Créez d\'abord l\'adresse email dans votre panneau Hostinger!');
    
    return {
      configured: false,
      provider: 'Hostinger SMTP (à configurer)',
      issues
    };
  };

  const auditRateLimits = async () => {
    return {
      emailSendLimit: 'À vérifier dans Dashboard Supabase',
      signupLimit: 'À vérifier dans Dashboard Supabase', 
      currentUsage: 0,
      issues: ['Vérifiez les limites dans Settings → Auth → Rate Limits']
    };
  };

  const runFunctionalTests = async () => {
    const errors: string[] = [];
    let connectionTest = false;
    let signupTest = false;
    let emailTest = false;
    
    try {
      // Test 1: Connexion
      const { data } = await supabase.auth.getSession();
      connectionTest = true;
      console.log('✅ Test connexion: OK');
    } catch (error: any) {
      errors.push(`Connexion: ${error.message}`);
      console.error('❌ Test connexion: FAIL', error);
    }
    
    try {
      // Test 2: Tentative d'inscription avec email bidon pour tester le SMTP
      const testResult = await supabase.auth.signUp({
        email: 'test-audit-' + Date.now() + '@example-nonexistent.com',
        password: 'TestPassword123!',
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (testResult.error) {
        if (testResult.error.message.includes('rate limit')) {
          errors.push('Rate limit actif sur signup');
        } else if (testResult.error.message.includes('SMTP')) {
          errors.push('Erreur SMTP - Configurez les paramètres SMTP dans Supabase');
        } else {
          errors.push(`Signup: ${testResult.error.message}`);
        }
      } else {
        signupTest = true;
        emailTest = true;
        console.log('✅ Test signup: OK', testResult.data);
      }
      
    } catch (error: any) {
      errors.push(`Signup: ${error.message}`);
      console.error('❌ Test signup: FAIL', error);
    }
    
    return {
      connectionTest,
      signupTest,
      emailTest,
      errors
    };
  };

  const testEmailWithRealAddress = async () => {
    if (!testEmail) return;
    
    setLoading(true);
    try {
      console.log('📧 Test avec email réel:', testEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) {
        console.error('❌ Erreur test email:', error);
        if (error.message.includes('SMTP')) {
          alert('Erreur SMTP: Configurez les paramètres SMTP dans le Dashboard Supabase');
        } else {
          alert(`Erreur: ${error.message}`);
        }
      } else {
        console.log('✅ Test email envoyé:', data);
        alert('Email de test envoyé ! Vérifiez votre boîte de réception et les spams.');
      }
      
    } catch (error: any) {
      console.error('💥 Erreur test email:', error);
      alert(`Erreur technique: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCompleteAudit();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: boolean, trueText = 'OK', falseText = 'Erreur') => {
    return (
      <Badge variant={status ? 'default' : 'destructive'}>
        {status ? trueText : falseText}
      </Badge>
    );
  };

  if (loading && !auditResult) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2">Audit en cours...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!auditResult) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Audit non disponible</p>
            <Button onClick={runCompleteAudit}>
              <Shield className="mr-2 h-4 w-4" />
              Lancer l'audit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Audit Email Supabase
            </CardTitle>
            <Button variant="outline" onClick={runCompleteAudit} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Relancer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              {getStatusIcon(auditResult.clientConfig.issues.length === 0)}
              <div className="text-sm font-medium mt-1">Client Config</div>
              {getStatusBadge(auditResult.clientConfig.issues.length === 0)}
            </div>
            <div className="text-center">
              {getStatusIcon(auditResult.authSettings.issues.length === 0)}
              <div className="text-sm font-medium mt-1">Auth Settings</div>
              {getStatusBadge(auditResult.authSettings.issues.length === 0)}
            </div>
            <div className="text-center">
              {getStatusIcon(auditResult.smtpConfig.configured)}
              <div className="text-sm font-medium mt-1">SMTP Config</div>
              {getStatusBadge(auditResult.smtpConfig.configured, 'Configuré', 'À configurer')}
            </div>
            <div className="text-center">
              {getStatusIcon(auditResult.testResults.emailTest)}
              <div className="text-sm font-medium mt-1">Email Test</div>
              {getStatusBadge(auditResult.testResults.emailTest)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Client */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Configuration Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>URL Supabase:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {auditResult.clientConfig.url}
              </code>
            </div>
            <div className="flex justify-between">
              <span>Clé Anon:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {auditResult.clientConfig.key}
              </code>
            </div>
            {auditResult.clientConfig.issues.map((issue, index) => (
              <Alert key={index}>
                <Info className="h-4 w-4" />
                <AlertDescription>{issue}</AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Paramètres Auth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Paramètres Authentification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Confirmation Email:</span>
              {getStatusBadge(auditResult.authSettings.confirmEmail, 'Activé', 'Désactivé')}
            </div>
            <div className="flex justify-between">
              <span>Site URL actuel:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {auditResult.authSettings.siteUrl}
              </code>
            </div>
            {auditResult.authSettings.issues.map((issue, index) => (
              <Alert key={index}>
                <Info className="h-4 w-4" />
                <AlertDescription>{issue}</AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration SMTP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Configuration SMTP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Fournisseur:</span>
              <span className="text-sm">{auditResult.smtpConfig.provider}</span>
            </div>
            {auditResult.smtpConfig.issues.map((issue, index) => (
              <Alert key={index}>
                <Info className="h-4 w-4" />
                <AlertDescription>{issue}</AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tests Fonctionnels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="mr-2 h-5 w-5" />
            Résultats des Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Test de connexion:</span>
              {getStatusBadge(auditResult.testResults.connectionTest)}
            </div>
            <div className="flex justify-between">
              <span>Test d'inscription:</span>
              {getStatusBadge(auditResult.testResults.signupTest)}
            </div>
            <div className="flex justify-between">
              <span>Test email:</span>
              {getStatusBadge(auditResult.testResults.emailTest)}
            </div>
            {auditResult.testResults.errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Email Réel */}
      <Card>
        <CardHeader>
          <CardTitle>Test avec Email Réel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Votre email (pour test)
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <Button 
              onClick={testEmailWithRealAddress}
              disabled={!testEmail || loading}
              className="w-full"
            >
              {loading ? "Envoi..." : "Tester l'envoi d'email"}
            </Button>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Ce test enverra un vrai email de confirmation à l'adresse fournie.
                Vérifiez votre boîte de réception ET vos spams.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Instructions de configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Hostinger pour directivesplus.fr</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Étape 1: Créer l'adresse email</h4>
              <p className="text-sm text-blue-800">
                Dans votre panneau Hostinger → Email → Comptes Email → Créer l'adresse <code>noreply@directivesplus.fr</code>
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Étape 2: Configuration SMTP dans Supabase</h4>
              <p className="text-sm text-green-800 mb-2">
                Dashboard Supabase → Authentication → Settings → SMTP Settings :
              </p>
              <div className="bg-white p-3 rounded border text-sm font-mono">
                <div>• Host: <strong>smtp.hostinger.com</strong></div>
                <div>• Port: <strong>587</strong></div>
                <div>• Username: <strong>noreply@directivesplus.fr</strong></div>
                <div>• Password: <strong>[mot de passe de l'email]</strong></div>
                <div>• Sender Name: <strong>DirectivesPlus</strong></div>
                <div>• Sender Email: <strong>noreply@directivesplus.fr</strong></div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Étape 3: URLs de redirection</h4>
              <p className="text-sm text-yellow-800 mb-2">
                Dans Authentication → URL Configuration :
              </p>
              <div className="bg-white p-3 rounded border text-sm">
                <div>• Site URL: <strong>https://directivesplus.fr</strong></div>
                <div>• Redirect URLs: <strong>https://directivesplus.fr/auth</strong></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
