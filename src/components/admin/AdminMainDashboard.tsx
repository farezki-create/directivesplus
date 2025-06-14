
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Database, 
  Shield, 
  Activity, 
  AlertTriangle,
  Settings,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const AdminMainDashboard = () => {
  const adminTools = [
    {
      title: "Gestion des Utilisateurs",
      description: "Gérer les comptes utilisateurs et les permissions",
      icon: Users,
      path: "/admin/users",
      color: "text-blue-600"
    },
    {
      title: "Audit Sécurité",
      description: "Rapport d'audit de sécurité complet",
      icon: Shield,
      path: "/admin/security-audit",
      color: "text-green-600"
    },
    {
      title: "Audit Supabase",
      description: "Diagnostic complet de Supabase (74 warnings détectés)",
      icon: Database,
      path: "/admin/supabase-audit",
      color: "text-purple-600",
      badge: "74 warnings"
    },
    {
      title: "Analyse Warnings",
      description: "Analyser et résoudre les 74 warnings Supabase",
      icon: AlertTriangle,
      path: "/supabase-audit",
      color: "text-orange-600",
      urgent: true
    },
    {
      title: "Monitoring Système",
      description: "Surveillance en temps réel du système",
      icon: Activity,
      path: "/admin/monitoring",
      color: "text-red-600"
    },
    {
      title: "Optimisation Supabase",
      description: "Outils d'optimisation de la base de données",
      icon: Settings,
      path: "/admin/optimization",
      color: "text-gray-600"
    },
    {
      title: "Statistiques",
      description: "Tableaux de bord et analytics",
      icon: BarChart3,
      path: "/admin/stats",
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Administrateur
            </h1>
            <p className="text-gray-600">
              Gestion et supervision de la plateforme DirectivesPlus
            </p>
          </div>

          {/* Alerte pour les warnings */}
          <div className="mb-8">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-orange-600 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-800 mb-1">
                      Attention : 74 warnings Supabase détectés
                    </h3>
                    <p className="text-orange-700 text-sm mb-3">
                      Des problèmes de configuration et de sécurité ont été identifiés et nécessitent votre attention.
                    </p>
                    <Link to="/supabase-audit">
                      <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                        Analyser maintenant
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grille des outils admin */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminTools.map((tool) => (
              <Link key={tool.path} to={tool.path}>
                <Card className={`h-full transition-all duration-200 hover:shadow-lg ${
                  tool.urgent ? 'border-orange-300 hover:border-orange-400' : 'hover:border-gray-300'
                }`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <tool.icon className={`h-6 w-6 ${tool.color} mr-3`} />
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                      </div>
                      {tool.badge && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Statistiques rapides */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Vue d'ensemble
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-500">Utilisateurs actifs</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">342</div>
                    <div className="text-sm text-gray-500">Directives créées</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">74</div>
                    <div className="text-sm text-gray-500">Warnings actifs</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">98.5%</div>
                    <div className="text-sm text-gray-500">Uptime</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMainDashboard;
