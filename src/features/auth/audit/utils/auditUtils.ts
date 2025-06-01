
import { supabase } from '@/integrations/supabase/client';

export const auditClientConfig = async () => {
  const issues: string[] = [];
  
  // Utiliser les valeurs hardcodées du client Supabase
  const url = "https://kytqqjnecezkxyhmmjrz.supabase.co";
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dHFxam5lY2V6a3h5aG1tanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxOTc5MjUsImV4cCI6MjA1Mjc3MzkyNX0.uocoNg-le-iv0pw7c99mthQ6gxGHyXGyQqgxo9_3CPc";
  
  // Test de connexion
  try {
    const { data } = await supabase.auth.getSession();
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

export const auditAuthSettings = async () => {
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

export const auditSMTPConfig = async () => {
  const issues: string[] = [];
  
  // Instructions spécifiques pour Hostinger avec la nouvelle adresse
  issues.push('Configuration SMTP Hostinger pour directivesplus.fr:');
  issues.push('• Host: smtp.hostinger.com');
  issues.push('• Port: 587 (STARTTLS recommandé)');
  issues.push('• Username: contact@directivesplus.fr');
  issues.push('• Password: [mot de passe de l\'email]');
  issues.push('• Sender Name: DirectivesPlus');
  issues.push('• Sender Email: contact@directivesplus.fr');
  issues.push('⚠️ Créez d\'abord l\'adresse email dans votre panneau Hostinger!');
  
  return {
    configured: false,
    provider: 'Hostinger SMTP (à configurer)',
    issues
  };
};

export const auditRateLimits = async () => {
  return {
    emailSendLimit: 'À vérifier dans Dashboard Supabase',
    signupLimit: 'À vérifier dans Dashboard Supabase', 
    currentUsage: 0,
    issues: ['Vérifiez les limites dans Settings → Auth → Rate Limits']
  };
};

export const runFunctionalTests = async () => {
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
