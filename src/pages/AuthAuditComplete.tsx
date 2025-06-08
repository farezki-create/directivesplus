
import React from 'react';
import Header from '@/components/Header';
import AuthenticationAudit from '@/components/auth/AuthenticationAudit';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Database, Mail, Users, Lock, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthAuditComplete = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Audit Complet d'Authentification
            </h1>
            <p className="text-gray-600">
              Analyse approfondie de tous les aspects de votre système d'authentification DirectivesPlus
            </p>
          </div>

          {/* Métriques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Niveau de sécurité</p>
                    <p className="text-2xl font-bold text-blue-600">Moyen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Database className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Base de données</p>
                    <p className="text-2xl font-bold text-green-600">OK</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Système email</p>
                    <p className="text-2xl font-bold text-yellow-600">À améliorer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Gestion utilisateurs</p>
                    <p className="text-2xl font-bold text-blue-600">Fonctionnel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Composant d'audit principal */}
          <AuthenticationAudit />

          {/* Recommandations détaillées */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Plan d'Amélioration Recommandé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-blue-800">Phase 1: Sécurisation immédiate</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li>• Implémenter la validation renforcée des mots de passe</li>
                    <li>• Ajouter la limitation des tentatives de connexion</li>
                    <li>• Configurer les logs de sécurité détaillés</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-green-800">Phase 2: Amélioration de l'expérience utilisateur</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li>• Implémenter le système de codes par email</li>
                    <li>• Ajouter la récupération de compte simplifiée</li>
                    <li>• Créer une interface d'administration des utilisateurs</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-purple-800">Phase 3: Fonctionnalités avancées</h3>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li>• Authentification à deux facteurs (2FA)</li>
                    <li>• Intégration avec des fournisseurs externes (Google, Microsoft)</li>
                    <li>• Système de notifications de sécurité</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Prochaines étapes recommandées:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Créer la table auth_codes_2fa pour les codes de vérification</li>
                  <li>Développer l'edge function d'envoi de codes par email</li>
                  <li>Implémenter l'interface utilisateur pour la saisie de codes</li>
                  <li>Tester le flux complet en environnement de développement</li>
                  <li>Déployer progressivement en production</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AuthAuditComplete;
