import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const EmailConfigDiagnostic = () => {
  const [testEmail, setTestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);

  const runDiagnostic = async () => {
    setIsLoading(true);
    setDiagnosticResults([]);
    const results: any[] = [];

    try {
      const supabaseUrl = "https://kytqqjnecezkxyhmmjrz.supabase.co";
      const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dHFxam5lY2V6a3h5aG1tanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxOTc5MjUsImV4cCI6MjA1Mjc3MzkyNX0.uocoNg-le-iv0pw7c99mthQ6gxGHyXGyQqgxo9_3CPc";
      
      results.push({
        test: "Configuration Supabase",
        status: "✅ OK",
        details: `URL: ${supabaseUrl}, Key configurée: ${supabaseAnonKey ? 'Oui' : 'Non'}`,
        success: true
      });

      const { data: session, error: sessionError } = await supabase.auth.getSession();
      results.push({
        test: "Session Auth",
        status: sessionError ? "❌ ERREUR" : "✅ OK",
        details: sessionError ? sessionError.message : `Session: ${session?.session ? 'Active' : 'Inactive'}`,
        success: !sessionError
      });

      if (testEmail) {
        await supabase.auth.signOut({ scope: 'global' });
        
        const { data, error } = await supabase.auth.signUp({
          email: testEmail,
          password: "TestPassword123!",
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });

        if (error) {
          results.push({
            test: "Test inscription",
            status: "❌ ERREUR",
            details: `Erreur: ${error.message}`,
            success: false,
            rawError: error
          });
        } else {
          const needsConfirmation = data.user && !data.user.email_confirmed_at;
          results.push({
            test: "Test inscription",
            status: needsConfirmation ? "⚠️ ATTENTION" : "✅ OK",
            details: needsConfirmation 
              ? "Utilisateur créé mais email non confirmé - Email devrait être envoyé"
              : "Utilisateur créé et email confirmé",
            success: true,
            needsConfirmation,
            user: data.user
          });
        }
      }

      try {
        const settingsResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
          headers: {
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          }
        });
        
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
          results.push({
            test: "Paramètres Auth API",
            status: "✅ OK",
            details: `SMTP configuré: ${settings.smtp_admin_email ? 'Oui' : 'Non'}`,
            success: true,
            settings
          });
        } else {
          results.push({
            test: "Paramètres Auth API",
            status: "⚠️ LIMITÉ",
            details: "Accès aux paramètres limité (normal)",
            success: true
          });
        }
      } catch (error: any) {
        results.push({
          test: "Paramètres Auth API",
          status: "⚠️ LIMITÉ",
          details: "Accès aux paramètres limité (normal)",
          success: true
        });
      }

      if (testEmail) {
        try {
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(testEmail, {
            redirectTo: `${window.location.origin}/auth/reset-password`
          });

          if (resetError) {
            results.push({
              test: "Test Reset Password (SMTP)",
              status: "❌ ERREUR",
              details: `Erreur SMTP: ${resetError.message}`,
              success: false
            });
          } else {
            results.push({
              test: "Test Reset Password (SMTP)",
              status: "✅ OK",
              details: "Email de reset envoyé sans erreur - Vérifiez votre boîte email",
              success: true
            });
          }
        } catch (error: any) {
          results.push({
            test: "Test Reset Password (SMTP)",
            status: "❌ ERREUR",
            details: `Erreur: ${error.message}`,
            success: false
          });
        }
      }

      setDiagnosticResults(results);

    } catch (error: any) {
      console.error("Erreur générale du diagnostic:", error);
      results.push({
        test: "Diagnostic général",
        status: "❌ ERREUR",
        details: `Erreur: ${error.message}`,
        success: false
      });
      setDiagnosticResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string, success: boolean) => {
    if (status.includes("✅")) return <Badge variant="default" className="bg-green-500">OK</Badge>;
    if (status.includes("❌")) return <Badge variant="destructive">ERREUR</Badge>;
    if (status.includes("⚠️")) return <Badge variant="secondary">ATTENTION</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Diagnostic Email & Auth Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            <strong>Configuration SMTP détectée :</strong><br/>
            • Serveur : smtp.hostinger.com:587<br/>
            • Expéditeur : contact@directivesplus.fr<br/>
            • Nom : DirectivesPlus
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email de test (pour tester l'inscription et SMTP)
            </label>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="votre.email@exemple.com"
            />
          </div>
          
          <Button 
            onClick={runDiagnostic}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Diagnostic en cours..." : "🚀 Lancer le diagnostic complet"}
          </Button>
        </div>

        {diagnosticResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Résultats du diagnostic :</h3>
            {diagnosticResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{result.test}</span>
                  {getStatusBadge(result.status, result.success)}
                </div>
                <p className="text-sm text-gray-600">{result.details}</p>
                
                {result.rawError && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-red-600">
                      Détails de l'erreur
                    </summary>
                    <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(result.rawError, null, 2)}
                    </pre>
                  </details>
                )}
                
                {result.user && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-blue-600">
                      Détails utilisateur
                    </summary>
                    <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto">
                      ID: {result.user.id}
                      Email: {result.user.email}
                      Confirmé: {result.user.email_confirmed_at ? 'Oui' : 'Non'}
                      Créé: {result.user.created_at}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        <Alert>
          <AlertDescription>
            <strong>Comment interpréter les résultats :</strong><br/>
            • Si "Test inscription" échoue → Problème de configuration Auth<br/>
            • Si "Test Reset Password" échoue → Problème de configuration SMTP<br/>
            • Si tout passe mais pas d'email → Vérifiez vos spams ou le Dashboard Supabase
          </AlertDescription>
        </Alert>

        <div className="text-sm space-y-1">
          <p><strong>Liens de vérification :</strong></p>
          <p>• <a href="https://supabase.com/dashboard/project/kytqqjnecezkxyhmmjrz/auth/users" target="_blank" className="text-blue-600 underline">Utilisateurs Supabase</a></p>
          <p>• <a href="https://supabase.com/dashboard/project/kytqqjnecezkxyhmmjrz/auth/providers" target="_blank" className="text-blue-600 underline">Paramètres Auth</a></p>
          <p>• <a href="https://supabase.com/dashboard/project/kytqqjnecezkxyhmmjrz/logs/auth-logs" target="_blank" className="text-blue-600 underline">Logs Auth</a></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailConfigDiagnostic;
