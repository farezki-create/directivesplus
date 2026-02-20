
import { useState, useEffect } from "react";
import IndexHeader from "@/components/sections/IndexHeader";
import HeroSection from "@/components/sections/HeroSection";
import DirectivesInfoSection from "@/components/sections/DirectivesInfoSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import InstitutionalAccessSection from "@/components/sections/InstitutionalAccessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/Footer";
import ChatAssistant from "@/components/ChatAssistant";
import CommunitySection from "@/components/sections/CommunitySection";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auditManager } from "@/utils/security/auditManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const [auditInProgress, setAuditInProgress] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Vérifier si l'utilisateur est admin
  const isAdmin = isAuthenticated && user?.email?.endsWith('@directivesplus.fr');

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  const handleSecurityAudit = async () => {
    setAuditInProgress(true);
    try {
      const auditReport = await auditManager.runFullAudit();
      setAuditResults(auditReport);
      
      toast({
        title: "Audit terminé",
        description: `Score global: ${auditReport.overallScore}% - Statut: ${auditReport.complianceStatus}`,
        variant: auditReport.complianceStatus === 'critical' ? 'destructive' : 'default'
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'audit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer l'audit de sécurité",
        variant: "destructive"
      });
    } finally {
      setAuditInProgress(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <IndexHeader />
      <HeroSection />
      <DirectivesInfoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CommunitySection />
      <InstitutionalAccessSection />
      <TestimonialsSection />
      <CTASection />
      
      {/* Section Audit de Sécurité pour Admin */}
      {isAdmin && (
        <div className="py-8 bg-gray-50 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Audit de Sécurité - Déploiement HDS
              </h2>
              
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Contrôles de Sécurité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={handleSecurityAudit}
                        disabled={auditInProgress}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {auditInProgress ? 'Audit en cours...' : 'Lancer Audit Complet'}
                      </Button>
                      
                      <Button
                        onClick={handleAdminAccess}
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Accès Administrateur
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {auditResults && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(auditResults.complianceStatus)}
                        Résultats de l'Audit
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Score Global:</span>
                            <span className="font-bold text-blue-600">{auditResults.overallScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Statut de Conformité:</span>
                            <span className={`font-medium ${
                              auditResults.complianceStatus === 'compliant' ? 'text-green-600' :
                              auditResults.complianceStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {auditResults.complianceStatus === 'compliant' ? 'Conforme' :
                               auditResults.complianceStatus === 'warning' ? 'Avertissements' : 'Critique'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prêt pour Production:</span>
                            <span className={`font-medium ${auditResults.readyForProduction ? 'text-green-600' : 'text-red-600'}`}>
                              {auditResults.readyForProduction ? 'Oui' : 'Non'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Conformité HDS:</span>
                            <span className="font-bold text-blue-600">{auditResults.hdsCompliance.score}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Problèmes Critiques:</span>
                            <span className={`font-medium ${auditResults.criticalIssues.length === 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {auditResults.criticalIssues.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Catégories Testées:</span>
                            <span className="font-medium text-gray-600">{auditResults.categories.length}</span>
                          </div>
                        </div>
                      </div>

                      {auditResults.criticalIssues.length > 0 && (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg">
                          <h4 className="font-semibold text-red-800 mb-2">⚠️ Problèmes Critiques à Résoudre:</h4>
                          <ul className="space-y-1 text-sm text-red-700">
                            {auditResults.criticalIssues.slice(0, 3).map((issue: any, index: number) => (
                              <li key={index}>• {issue.description}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {auditResults.recommendations.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">📋 Recommandations:</h4>
                          <ul className="space-y-1 text-sm text-blue-700">
                            {auditResults.recommendations.slice(0, 5).map((rec: string, index: number) => (
                              <li key={index}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-4 text-center">
                        <Button
                          onClick={() => navigate('/security-audit-report')}
                          variant="outline"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          Voir Rapport Détaillé
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
      <ChatAssistant />
    </div>
  );
};

export default Index;
