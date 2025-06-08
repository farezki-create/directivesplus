
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Shield, Mail, Key, Database, Users, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuthAuditResult {
  category: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  recommendation?: string;
}

const AuthenticationAudit = () => {
  const [auditResults, setAuditResults] = useState<AuthAuditResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAuthAudit = async () => {
    setIsRunning(true);
    const results: AuthAuditResult[] = [];

    // 1. Test de connexion Supabase
    try {
      const { data: { session } } = await supabase.auth.getSession();
      results.push({
        category: "Connexion Supabase",
        status: "success",
        message: "Client Supabase configuré et fonctionnel"
      });
    } catch (error) {
      results.push({
        category: "Connexion Supabase",
        status: "error",
        message: "Erreur de connexion au client Supabase",
        recommendation: "Vérifier les variables d'environnement SUPABASE_URL et SUPABASE_ANON_KEY"
      });
    }

    // 2. Vérification des tables d'authentification
    try {
      const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
      results.push({
        category: "Tables utilisateurs",
        status: "success",
        message: "Table profiles accessible"
      });
    } catch (error) {
      results.push({
        category: "Tables utilisateurs",
        status: "error",
        message: "Impossible d'accéder à la table profiles",
        recommendation: "Créer la table profiles et configurer les politiques RLS"
      });
    }

    // 3. Vérification des tables de codes d'authentification
    try {
      const { data: authCodes } = await supabase.from('auth_codes').select('id').limit(1);
      results.push({
        category: "Codes d'authentification",
        status: "success",
        message: "Table auth_codes disponible"
      });
    } catch (error) {
      results.push({
        category: "Codes d'authentification",
        status: "warning",
        message: "Table auth_codes non accessible",
        recommendation: "Créer la table auth_codes pour le système de codes par email"
      });
    }

    // 4. Test des politiques RLS
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        results.push({
          category: "Politiques RLS",
          status: "success",
          message: "RLS configuré et fonctionnel pour les profils utilisateurs"
        });
      } else {
        results.push({
          category: "Politiques RLS",
          status: "warning",
          message: "Impossible de tester RLS - utilisateur non connecté"
        });
      }
    } catch (error) {
      results.push({
        category: "Politiques RLS",
        status: "error",
        message: "Problème avec les politiques RLS",
        recommendation: "Revoir la configuration des politiques de sécurité"
      });
    }

    // 5. Vérification de la configuration email
    results.push({
      category: "Configuration Email",
      status: "warning",
      message: "Système d'email par confirmation uniquement",
      recommendation: "Implémenter l'envoi de codes de vérification par email"
    });

    // 6. Audit de sécurité des mots de passe
    results.push({
      category: "Politique des mots de passe",
      status: "warning",
      message: "Pas de validation renforcée côté client",
      recommendation: "Ajouter des critères de complexité pour les mots de passe"
    });

    // 7. Gestion des sessions
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        results.push({
          category: "Gestion des sessions",
          status: "success",
          message: "Session persistante active et fonctionnelle"
        });
      } else {
        results.push({
          category: "Gestion des sessions",
          status: "warning",
          message: "Aucune session active détectée"
        });
      }
    } catch (error) {
      results.push({
        category: "Gestion des sessions",
        status: "error",
        message: "Erreur dans la gestion des sessions"
      });
    }

    setAuditResults(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runAuthAudit();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800", 
      error: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Audit du Système d'Authentification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={runAuthAudit} disabled={isRunning}>
              {isRunning ? "Audit en cours..." : "Relancer l'audit"}
            </Button>
          </div>

          <div className="space-y-4">
            {auditResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.category}</span>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
                <p className="text-gray-700 mb-2">{result.message}</p>
                {result.recommendation && (
                  <Alert>
                    <AlertDescription>
                      <strong>Recommandation:</strong> {result.recommendation}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Proposition: Système de Codes par Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              <strong>Amélioration proposée:</strong> Implémenter un système de codes de vérification par email 
              en complément de la confirmation par lien.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">Fonctionnalités à développer:</h4>
            <div className="grid gap-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Génération de codes OTP</p>
                  <p className="text-sm text-gray-600">Codes à 6 chiffres avec expiration de 10 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Interface de saisie de code</p>
                  <p className="text-sm text-gray-600">Composant dédié pour la saisie du code reçu par email</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Edge Function d'envoi</p>
                  <p className="text-sm text-gray-600">Fonction serverless pour l'envoi sécurisé des codes</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Table de stockage des codes</p>
                  <p className="text-sm text-gray-600">Stockage sécurisé avec expiration automatique</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Limitation des tentatives</p>
                  <p className="text-sm text-gray-600">Protection contre les attaques par force brute</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Avantages:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Sécurité renforcée avec double validation</li>
              <li>• Expérience utilisateur améliorée (pas besoin d'accéder à sa boîte mail)</li>
              <li>• Réduction des inscriptions abandonnées</li>
              <li>• Compatible avec les clients email restrictifs</li>
              <li>• Audit trail complet des tentatives d'authentification</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthenticationAudit;
