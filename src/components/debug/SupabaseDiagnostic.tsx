
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const SupabaseDiagnostic = () => {
  const [testEmail, setTestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);

  const runFullDiagnostic = async () => {
    setIsLoading(true);
    setDiagnosticResults([]);
    const results: any[] = [];

    try {
      // Test 1: Configuration Supabase
      console.log("🔍 Test 1: Configuration Supabase");
      const supabaseUrl = "https://kytqqjnecezkxyhmmjrz.supabase.co";
      const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dHFxam5lY2V6a3h5aG1tanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxOTc5MjUsImV4cCI6MjA1Mjc3MzkyNX0.uocoNg-le-iv0pw7c99mthQ6gxGHyXGyQqgxo9_3CPc";
      
      results.push({
        test: "Configuration Supabase",
        status: "✅ OK",
        details: `URL: ${supabaseUrl}, Key: ${supabaseAnonKey ? 'Configurée' : 'Manquante'}`,
        success: true
      });

      // Test 2: Connectivité de base
      console.log("🔍 Test 2: Test de connectivité");
      try {
        const { data: healthCheck, error: healthError } = await supabase
          .from('user_otp')
          .select('count', { count: 'exact', head: true });
        
        if (healthError) {
          results.push({
            test: "Connectivité Supabase",
            status: "❌ ERREUR",
            details: `Erreur: ${healthError.message}`,
            success: false,
            error: healthError
          });
        } else {
          results.push({
            test: "Connectivité Supabase",
            status: "✅ OK",
            details: "Communication avec la base de données réussie",
            success: true
          });
        }
      } catch (error: any) {
        results.push({
          test: "Connectivité Supabase",
          status: "❌ ERREUR",
          details: `Erreur de connexion: ${error.message}`,
          success: false,
          error
        });
      }

      // Test 3: Test Edge Function OTP directement
      console.log("🔍 Test 3: Test Edge Function send-otp");
      if (testEmail) {
        try {
          const otpResponse = await fetch('https://kytqqjnecezkxyhmmjrz.supabase.co/functions/v1/send-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`
            },
            body: JSON.stringify({ email: testEmail })
          });

          const otpData = await otpResponse.json();
          
          results.push({
            test: "Edge Function send-otp",
            status: otpResponse.ok ? "✅ OK" : "❌ ERREUR",
            details: otpResponse.ok 
              ? `Fonction appelée avec succès: ${JSON.stringify(otpData)}`
              : `Erreur HTTP ${otpResponse.status}: ${JSON.stringify(otpData)}`,
            success: otpResponse.ok,
            response: otpData
          });
        } catch (error: any) {
          results.push({
            test: "Edge Function send-otp",
            status: "❌ ERREUR",
            details: `Erreur d'appel: ${error.message}`,
            success: false,
            error
          });
        }
      }

      // Test 4: Test via supabase.functions.invoke
      console.log("🔍 Test 4: Test via supabase.functions.invoke");
      if (testEmail) {
        try {
          const { data: invokeData, error: invokeError } = await supabase.functions.invoke('send-otp', {
            body: { email: testEmail }
          });

          if (invokeError) {
            results.push({
              test: "Supabase Functions Invoke",
              status: "❌ ERREUR",
              details: `Erreur invoke: ${invokeError.message}`,
              success: false,
              error: invokeError
            });
          } else {
            results.push({
              test: "Supabase Functions Invoke",
              status: "✅ OK",
              details: `Invocation réussie: ${JSON.stringify(invokeData)}`,
              success: true,
              response: invokeData
            });
          }
        } catch (error: any) {
          results.push({
            test: "Supabase Functions Invoke",
            status: "❌ ERREUR",
            details: `Erreur d'invocation: ${error.message}`,
            success: false,
            error
          });
        }
      }

      // Test 5: Vérification de la table user_otp
      console.log("🔍 Test 5: Test table user_otp");
      try {
        const { data: otpData, error: otpError } = await supabase
          .from('user_otp')
          .select('*')
          .limit(1);

        if (otpError) {
          results.push({
            test: "Table user_otp",
            status: "❌ ERREUR",
            details: `Erreur d'accès à la table: ${otpError.message}`,
            success: false,
            error: otpError
          });
        } else {
          results.push({
            test: "Table user_otp",
            status: "✅ OK",
            details: `Table accessible, ${otpData?.length || 0} enregistrements trouvés`,
            success: true,
            data: otpData
          });
        }
      } catch (error: any) {
        results.push({
          test: "Table user_otp",
          status: "❌ ERREUR",
          details: `Erreur d'accès: ${error.message}`,
          success: false,
          error
        });
      }

      // Test 6: Test de session Auth
      console.log("🔍 Test 6: Session Auth");
      try {
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        
        results.push({
          test: "Session Auth",
          status: sessionError ? "❌ ERREUR" : "ℹ️ INFO",
          details: sessionError 
            ? `Erreur de session: ${sessionError.message}`
            : `Session: ${session?.session ? 'Active' : 'Inactive'}`,
          success: !sessionError,
          session: session?.session
        });
      } catch (error: any) {
        results.push({
          test: "Session Auth",
          status: "❌ ERREUR",
          details: `Erreur de session: ${error.message}`,
          success: false,
          error
        });
      }

      setDiagnosticResults(results);

    } catch (error: any) {
      console.error("Erreur générale du diagnostic:", error);
      results.push({
        test: "Diagnostic général",
        status: "❌ ERREUR",
        details: `Erreur: ${error.message}`,
        success: false,
        error
      });
      setDiagnosticResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string, success: boolean) => {
    if (status.includes("✅")) return <Badge variant="default" className="bg-green-500">OK</Badge>;
    if (status.includes("❌")) return <Badge variant="destructive">ERREUR</Badge>;
    if (status.includes("ℹ️")) return <Badge variant="secondary">INFO</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>🔧 Diagnostic Complet Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              <strong>Diagnostic complet de la communication Supabase</strong><br/>
              Ce diagnostic va tester tous les aspects de la connexion à Supabase.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email de test (pour tester l'envoi OTP)
              </label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
              />
            </div>
            
            <Button 
              onClick={runFullDiagnostic}
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
                  <p className="text-sm text-gray-600 mb-2">{result.details}</p>
                  
                  {result.error && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-red-600">
                        Détails de l'erreur
                      </summary>
                      <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </details>
                  )}
                  
                  {result.response && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-blue-600">
                        Réponse détaillée
                      </summary>
                      <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-sm space-y-2 bg-blue-50 p-4 rounded-lg">
            <p><strong>Liens de vérification Supabase :</strong></p>
            <p>• <a href="https://supabase.com/dashboard/project/kytqqjnecezkxyhmmjrz/functions" target="_blank" className="text-blue-600 underline">Edge Functions</a></p>
            <p>• <a href="https://supabase.com/dashboard/project/kytqqjnecezkxyhmmjrz/functions/send-otp/logs" target="_blank" className="text-blue-600 underline">Logs send-otp</a></p>
            <p>• <a href="https://supabase.com/dashboard/project/kytqqjnecezkxyhmmjrz/settings/functions" target="_blank" className="text-blue-600 underline">Secrets Functions</a></p>
            <p>• <a href="https://supabase.com/dashboard/project/kytqqjnecezkxyhmmjrz/editor" target="_blank" className="text-blue-600 underline">Éditeur SQL</a></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseDiagnostic;
