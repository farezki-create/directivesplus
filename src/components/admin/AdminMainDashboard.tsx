
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Shield, 
  Users, 
  Building2, 
  Activity, 
  Settings,
  AlertTriangle,
  TrendingUp,
  Server,
  FileText,
  Globe,
  Lock
} from "lucide-react";
import { Link } from "react-router-dom";
import AppNavigation from "@/components/AppNavigation";
import SupabaseAuditDashboard from "./SupabaseAuditDashboard";
import SupabaseOptimizationPanel from "./SupabaseOptimizationPanel";
import SecurityAuditDashboard from "@/components/security/SecurityAuditDashboard";
import SystemMonitoringDashboard from "./SystemMonitoringDashboard";
import UserManagementDashboard from "./UserManagementDashboard";
import InstitutionManagement from "./InstitutionManagement";

const AdminMainDashboard = () => {
  const adminTools = [
    {
      id: "users",
      title: "Gestion Utilisateurs",
      description: "Gérer les comptes utilisateurs et les profils",
      icon: Users,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      count: "1,234"
    },
    {
      id: "institutions",
      title: "Institutions",
      description: "Gérer les abonnements institutionnels",
      icon: Building2,
      color: "bg-green-50 border-green-200 text-green-800",
      count: "56"
    },
    {
      id: "security",
      title: "Audit Sécurité",
      description: "Surveillance et conformité sécurité",
      icon: Shield,
      color: "bg-red-50 border-red-200 text-red-800",
      count: "98%"
    },
    {
      id: "database",
      title: "Base de Données",
      description: "Audit et optimisation Supabase",
      icon: Database,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      count: "Optimal"
    },
    {
      id: "monitoring",
      title: "Surveillance Système",
      description: "Métriques et performance en temps réel",
      icon: Activity,
      color: "bg-orange-50 border-orange-200 text-orange-800",
      count: "99.9%"
    },
    {
      id: "optimization",
      title: "Optimisation",
      description: "Améliorations et configuration",
      icon: TrendingUp,
      color: "bg-yellow-50 border-yellow-200 text-yellow-800",
      count: "85%"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation hideEditingFeatures={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Centre d'Administration
            </h1>
            <p className="text-gray-600">
              Tableau de bord complet pour la gestion et surveillance de DirectivesPlus
            </p>
          </div>

          {/* Vue d'ensemble rapide */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {adminTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card key={tool.id} className={`${tool.color} hover:shadow-lg transition-shadow cursor-pointer`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-1">{tool.count}</div>
                    <p className="text-xs opacity-80">{tool.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Onglets principaux */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="database">Base de données</TabsTrigger>
              <TabsTrigger value="monitoring">Surveillance</TabsTrigger>
              <TabsTrigger value="optimization">Optimisation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Statut Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Base de données</span>
                        <span className="text-green-600 font-medium">Opérationnel</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Authentification</span>
                        <span className="text-green-600 font-medium">Opérationnel</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Stockage</span>
                        <span className="text-green-600 font-medium">Opérationnel</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">API</span>
                        <span className="text-green-600 font-medium">Opérationnel</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Alertes Récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">Utilisation CPU élevée</div>
                          <div className="text-xs text-gray-600">Base de données - 15:30</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">Nouvelle tentative d'accès</div>
                          <div className="text-xs text-gray-600">Sécurité - 14:45</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Métriques Rapides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">1,234</div>
                        <div className="text-sm text-gray-600">Utilisateurs actifs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">5,678</div>
                        <div className="text-sm text-gray-600">Documents stockés</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">99.8%</div>
                        <div className="text-sm text-gray-600">Disponibilité</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">245ms</div>
                        <div className="text-sm text-gray-600">Temps de réponse</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <UserManagementDashboard />
            </TabsContent>

            <TabsContent value="security">
              <SecurityAuditDashboard />
            </TabsContent>

            <TabsContent value="database">
              <Tabs defaultValue="audit" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="audit">Audit Complet</TabsTrigger>
                  <TabsTrigger value="optimization">Optimisation</TabsTrigger>
                </TabsList>
                <TabsContent value="audit">
                  <SupabaseAuditDashboard />
                </TabsContent>
                <TabsContent value="optimization">
                  <SupabaseOptimizationPanel />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="monitoring">
              <SystemMonitoringDashboard />
            </TabsContent>

            <TabsContent value="optimization">
              <Card>
                <CardHeader>
                  <CardTitle>Optimisations Recommandées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Optimisation des index</div>
                          <div className="text-sm text-gray-600">Améliorer les performances des requêtes</div>
                        </div>
                      </div>
                      <Link to="/admin/supabase-audit" className="text-blue-600 hover:underline">
                        Configurer
                      </Link>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Renforcement sécurité</div>
                          <div className="text-sm text-gray-600">Mise à jour des politiques RLS</div>
                        </div>
                      </div>
                      <span className="text-green-600 font-medium">Complété</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminMainDashboard;
