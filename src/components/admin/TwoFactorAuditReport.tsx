
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Target,
  Zap,
  Lock,
  Smartphone
} from 'lucide-react';
import { TwoFactorAuditService, TwoFactorAuditResult } from '@/features/auth/audit/TwoFactorAuditService';

export const TwoFactorAuditReport: React.FC = () => {
  const [auditResult, setAuditResult] = useState<TwoFactorAuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    try {
      const result = await TwoFactorAuditService.performAudit();
      setAuditResult(result);
    } catch (error) {
      console.error('Erreur lors de l\'audit 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '2FA_DISABLED': return 'destructive';
      case '2FA_BASIC': return 'default';
      case '2FA_ADVANCED': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case '2FA_DISABLED': return '2FA Désactivé';
      case '2FA_BASIC': return '2FA Basique';
      case '2FA_ADVANCED': return '2FA Avancé';
      default: return 'Inconnu';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'outline';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'SIMPLE': return <Zap className="h-4 w-4 text-green-600" />;
      case 'MODERATE': return <Target className="h-4 w-4 text-yellow-600" />;
      case 'COMPLEX': return <Lock className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Audit Authentification 2FA
          </CardTitle>
          <CardDescription>
            Analyse complète du système d'authentification à deux facteurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runAudit} disabled={loading} className="w-full">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyse en cours...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Lancer l'audit 2FA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {auditResult && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            <TabsTrigger value="implementation">Plan d'implémentation</TabsTrigger>
            <TabsTrigger value="quickstart">Démarrage rapide</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Statut actuel</p>
                      <Badge variant={getStatusColor(auditResult.currentStatus)}>
                        {getStatusText(auditResult.currentStatus)}
                      </Badge>
                    </div>
                    <Shield className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Score de sécurité</p>
                      <p className="text-2xl font-bold">{auditResult.securityScore}/100</p>
                    </div>
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Complexité</p>
                      <div className="flex items-center gap-2">
                        {getComplexityIcon(auditResult.estimatedComplexity)}
                        <span className="font-medium">{auditResult.estimatedComplexity}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {auditResult.securityScore < 50 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Attention :</strong> Votre score de sécurité est faible. 
                  Il est fortement recommandé d'implémenter l'authentification 2FA.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {auditResult.recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        {rec.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Avantages :</h4>
                      <ul className="space-y-1">
                        {rec.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Implémentation :</h4>
                      <p className="text-sm text-muted-foreground">{rec.implementation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="implementation" className="space-y-4">
            {auditResult.implementationPlan.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">Étape {step.step}</Badge>
                    {step.title}
                  </CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {step.codeExample && (
                    <div>
                      <h4 className="font-medium mb-2">Exemple de code :</h4>
                      <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                        <code>{step.codeExample}</code>
                      </pre>
                    </div>
                  )}
                  {step.configuration && (
                    <div>
                      <h4 className="font-medium mb-2">Configuration :</h4>
                      <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                        <code>{JSON.stringify(step.configuration, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                  {step.dependencies && (
                    <div>
                      <h4 className="font-medium mb-2">Dépendances :</h4>
                      <div className="flex flex-wrap gap-2">
                        {step.dependencies.map((dep, i) => (
                          <Badge key={i} variant="secondary">{dep}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="quickstart" className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Smartphone className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Solution recommandée :</strong> Authentification OTP par email - 
                La plus simple et rapide à implémenter avec votre système existant.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">🚀 Démarrage Rapide - Email OTP</CardTitle>
                <CardDescription>
                  Implémentation en 1-2 heures maximum avec votre infrastructure existante
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">✅ Avantages</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Aucun coût supplémentaire</li>
                      <li>• Compatible avec le système actuel</li>
                      <li>• Edge Functions déjà créées</li>
                      <li>• Interface simple à ajouter</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">🔧 Étapes</h4>
                    <ol className="text-sm space-y-1">
                      <li>1. Utiliser OTPAuthForm existant</li>
                      <li>2. Configurer la validation</li>
                      <li>3. Tester les fonctions existantes</li>
                      <li>4. Déployer</li>
                    </ol>
                  </div>
                </div>
                
                <Alert>
                  <AlertDescription>
                    <strong>Bonne nouvelle :</strong> Votre système a déjà les Edge Functions 
                    <code>send-otp</code> et <code>verify-otp</code> configurées ! 
                    Il suffit d'intégrer le composant OTPAuthForm dans votre flow d'authentification.
                  </AlertDescription>
                </Alert>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Zap className="mr-2 h-4 w-4" />
                  Implémenter la solution Email OTP
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
