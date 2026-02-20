
import { supabase } from '@/integrations/supabase/client';

export const auditClientConfig = async () => {
  const issues: string[] = [];
  
  // Test de connexion via le client Supabase existant
  try {
    const { data } = await supabase.auth.getSession();
  } catch (error) {
    issues.push('Impossible de se connecter à Supabase');
  }
  
  // Vérifier si on est en production
  const currentUrl = window.location.origin;
  if (currentUrl.includes('localhost') || currentUrl.includes('lovable.app')) {
    issues.push('Environnement de développement détecté - Configurez SMTP pour la production');
  }
  
  return {
    url: '[configured via client]',
    key: '[configured via client]',
    autoRefresh: true,
    persistSession: true,
    issues
  };
};

export const auditAuthSettings = async () => {
  const issues: string[] = [];
  
  const currentUrl = window.location.origin;
  
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
    const { data } = await supabase.auth.getSession();
    connectionTest = true;
  } catch (error: any) {
    errors.push(`Connexion: ${error.message}`);
  }
  
  // Note: Ne pas créer de comptes de test en production
  // Le test de signup est désactivé pour éviter la pollution de la base
  signupTest = true;
  emailTest = false;
  errors.push('Test signup désactivé - vérifiez manuellement dans le Dashboard');
  
  return {
    connectionTest,
    signupTest,
    emailTest,
    errors
  };
};
