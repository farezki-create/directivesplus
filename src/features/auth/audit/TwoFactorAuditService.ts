
import { supabase } from '@/integrations/supabase/client';

export interface TwoFactorAuditResult {
  currentStatus: '2FA_DISABLED' | '2FA_BASIC' | '2FA_ADVANCED';
  securityScore: number;
  recommendations: TwoFactorRecommendation[];
  implementationPlan: ImplementationStep[];
  estimatedComplexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX';
}

export interface TwoFactorRecommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  benefits: string[];
  implementation: string;
  estimatedTime: string;
}

export interface ImplementationStep {
  step: number;
  title: string;
  description: string;
  codeExample?: string;
  configuration?: Record<string, any>;
  dependencies?: string[];
}

export class TwoFactorAuditService {
  static async performAudit(): Promise<TwoFactorAuditResult> {
    console.log('🔍 Audit 2FA - Analyse du système d\'authentification...');
    
    const currentStatus = await this.analyzeCurrentStatus();
    const securityScore = this.calculateSecurityScore(currentStatus);
    const recommendations = this.generateRecommendations(currentStatus);
    const implementationPlan = this.createImplementationPlan(currentStatus);
    const estimatedComplexity = this.estimateComplexity(recommendations);
    
    return {
      currentStatus,
      securityScore,
      recommendations,
      implementationPlan,
      estimatedComplexity
    };
  }
  
  private static async analyzeCurrentStatus(): Promise<'2FA_DISABLED' | '2FA_BASIC' | '2FA_ADVANCED'> {
    try {
      // Vérifier si l'utilisateur a des méthodes 2FA configurées
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return '2FA_DISABLED';
      }
      
      // Analyser les méthodes d'authentification disponibles
      const factors = user.factors || [];
      
      if (factors.length === 0) {
        return '2FA_DISABLED';
      }
      
      // Vérifier le type de facteurs configurés
      const hasAdvancedFactors = factors.some(factor => 
        factor.factor_type === 'totp' || 
        factor.factor_type === 'webauthn'
      );
      
      return hasAdvancedFactors ? '2FA_ADVANCED' : '2FA_BASIC';
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse 2FA:', error);
      return '2FA_DISABLED';
    }
  }
  
  private static calculateSecurityScore(status: string): number {
    switch (status) {
      case '2FA_DISABLED':
        return 25; // Score très faible sans 2FA
      case '2FA_BASIC':
        return 65; // Score moyen avec 2FA basique
      case '2FA_ADVANCED':
        return 90; // Score élevé avec 2FA avancé
      default:
        return 0;
    }
  }
  
  private static generateRecommendations(status: string): TwoFactorRecommendation[] {
    const recommendations: TwoFactorRecommendation[] = [];
    
    if (status === '2FA_DISABLED') {
      recommendations.push({
        priority: 'HIGH',
        title: 'Activer l\'authentification par SMS',
        description: 'Implémentation simple et rapide pour renforcer immédiatement la sécurité',
        benefits: [
          'Protection contre 95% des attaques de force brute',
          'Implémentation en moins d\'une heure',
          'Interface utilisateur simple',
          'Compatible avec tous les appareils'
        ],
        implementation: 'Utiliser l\'API Supabase Auth avec vérification SMS',
        estimatedTime: '2-4 heures'
      });
      
      recommendations.push({
        priority: 'HIGH',
        title: 'Authentification par email avec code OTP',
        description: 'Alternative gratuite et efficace au SMS',
        benefits: [
          'Aucun coût supplémentaire',
          'Très simple à implémenter',
          'Sécurité renforcée',
          'Fonctionne partout dans le monde'
        ],
        implementation: 'Edge functions Supabase pour générer et valider les codes',
        estimatedTime: '1-2 heures'
      });
    }
    
    if (status === '2FA_DISABLED' || status === '2FA_BASIC') {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Authentification TOTP (Google Authenticator)',
        description: 'Standard industrie pour l\'authentification à deux facteurs',
        benefits: [
          'Fonctionne hors ligne',
          'Très sécurisé',
          'Supporté par de nombreuses apps',
          'Pas de dépendance externe'
        ],
        implementation: 'Intégration avec une librairie TOTP et QR codes',
        estimatedTime: '4-6 heures'
      });
      
      recommendations.push({
        priority: 'LOW',
        title: 'WebAuthn / FIDO2',
        description: 'Authentification biométrique moderne',
        benefits: [
          'Sécurité maximale',
          'Expérience utilisateur excellente',
          'Résistant au phishing',
          'Standard moderne'
        ],
        implementation: 'WebAuthn API avec fallback',
        estimatedTime: '8-12 heures'
      });
    }
    
    // Recommandations générales
    recommendations.push({
      priority: 'MEDIUM',
      title: 'Rate limiting renforcé',
      description: 'Protection contre les attaques par force brute',
      benefits: [
        'Bloque les tentatives automatisées',
        'Préserve les performances',
        'Logging des tentatives suspectes'
      ],
      implementation: 'Middleware avec Redis ou base de données',
      estimatedTime: '2-3 heures'
    });
    
    return recommendations;
  }
  
  private static createImplementationPlan(status: string): ImplementationStep[] {
    const steps: ImplementationStep[] = [];
    
    if (status === '2FA_DISABLED') {
      steps.push({
        step: 1,
        title: 'Configuration Supabase Auth',
        description: 'Activer les options 2FA dans le dashboard Supabase',
        configuration: {
          enable_phone_confirmations: true,
          enable_phone_change_confirmations: true,
          phone_change_token_validity_period: 300
        }
      });
      
      steps.push({
        step: 2,
        title: 'Implémentation du composant OTP',
        description: 'Créer l\'interface utilisateur pour la saisie du code',
        codeExample: `
// Composant OTP simple et efficace
const OTPInput = ({ onVerify }) => {
  const [code, setCode] = useState('');
  
  const handleVerify = async () => {
    const { error } = await supabase.auth.verifyOtp({
      phone: userPhone,
      token: code,
      type: 'sms'
    });
    
    if (!error) {
      onVerify();
    }
  };
  
  return (
    <div className="space-y-4">
      <Input 
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Entrez le code reçu"
        maxLength={6}
      />
      <Button onClick={handleVerify}>Vérifier</Button>
    </div>
  );
};`
      });
      
      steps.push({
        step: 3,
        title: 'Gestion des erreurs et UX',
        description: 'Implémenter une gestion d\'erreur robuste et une expérience utilisateur fluide',
        codeExample: `
// Gestion d'erreur avec retry automatique
const handleOTPError = (error) => {
  if (error.message.includes('expired')) {
    showToast('Code expiré. Un nouveau code a été envoyé.');
    resendOTP();
  } else if (error.message.includes('invalid')) {
    showToast('Code incorrect. Veuillez réessayer.');
    setCode('');
  }
};`
      });
      
      steps.push({
        step: 4,
        title: 'Tests et validation',
        description: 'Tester tous les scénarios possibles',
        configuration: {
          test_scenarios: [
            'Code valide',
            'Code expiré',
            'Code incorrect',
            'Tentatives multiples',
            'Resend du code'
          ]
        }
      });
    }
    
    return steps;
  }
  
  private static estimateComplexity(recommendations: TwoFactorRecommendation[]): 'SIMPLE' | 'MODERATE' | 'COMPLEX' {
    const highPriorityCount = recommendations.filter(r => r.priority === 'HIGH').length;
    const totalEstimatedHours = recommendations.reduce((total, rec) => {
      const hours = parseInt(rec.estimatedTime.split('-')[1] || '2');
      return total + hours;
    }, 0);
    
    if (totalEstimatedHours <= 6 && highPriorityCount <= 2) {
      return 'SIMPLE';
    } else if (totalEstimatedHours <= 12) {
      return 'MODERATE';
    } else {
      return 'COMPLEX';
    }
  }
  
  // Méthode utilitaire pour obtenir des recommandations spécifiques
  static getQuickStartRecommendation(): TwoFactorRecommendation {
    return {
      priority: 'HIGH',
      title: 'Solution 2FA Rapide - Email OTP',
      description: 'La solution la plus simple et rapide à implémenter',
      benefits: [
        '✅ Implémentation en 1-2 heures',
        '✅ Aucun coût supplémentaire',
        '✅ Compatible avec le système existant',
        '✅ Sécurité immédiatement renforcée'
      ],
      implementation: `
1. Utiliser les Edge Functions existantes (send-otp, verify-otp)
2. Ajouter un composant OTP à l'interface de connexion
3. Configurer la validation côté client
4. Tester et déployer`,
      estimatedTime: '1-2 heures'
    };
  }
}
