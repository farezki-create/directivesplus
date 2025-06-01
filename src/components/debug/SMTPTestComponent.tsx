
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SMTPTestComponent = () => {
  const [testEmail, setTestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    error?: any;
  } | null>(null);

  const testPasswordReset = async () => {
    if (!testEmail) {
      setResult({
        success: false,
        message: "Veuillez entrer un email de test"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      console.log("🧪 Test d'envoi email via Supabase SMTP...");
      
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        console.error("❌ Erreur Supabase Auth:", error);
        setResult({
          success: false,
          message: `Erreur Supabase: ${error.message}`,
          error: error
        });
      } else {
        console.log("✅ Demande de reset envoyée sans erreur Supabase");
        setResult({
          success: true,
          message: "Email de reset envoyé avec succès ! Vérifiez votre boîte de réception et les logs Supabase."
        });
      }
    } catch (error: any) {
      console.error("💥 Erreur durant le test:", error);
      setResult({
        success: false,
        message: `Erreur technique: ${error.message}`,
        error: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSignUp = async () => {
    if (!testEmail) {
      setResult({
        success: false,
        message: "Veuillez entrer un email de test"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      console.log("🧪 Test d'inscription via Supabase SMTP...");
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: "MyUniqueTest2024$!",
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (error) {
        console.error("❌ Erreur Supabase Auth (inscription):", error);
        setResult({
          success: false,
          message: `Erreur inscription: ${error.message}`,
          error: error
        });
      } else {
        console.log("✅ Inscription réussie:", data);
        setResult({
          success: true,
          message: "Inscription réussie ! Email de confirmation envoyé (si SMTP configuré)."
        });
      }
    } catch (error: any) {
      console.error("💥 Erreur durant le test d'inscription:", error);
      setResult({
        success: false,
        message: `Erreur technique: ${error.message}`,
        error: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testNodeJSEdgeFunction = async () => {
    if (!testEmail) {
      setResult({
        success: false,
        message: "Veuillez entrer un email de test"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      console.log("🧪 Test SMTP via Edge Function Node.js...");
      
      const { data, error } = await supabase.functions.invoke('test-smtp', {
        body: {
          recipient_email: testEmail,
          test_type: 'fetch'
        }
      });

      if (error) {
        console.error("❌ Erreur Edge Function:", error);
        setResult({
          success: false,
          message: `Erreur Edge Function: ${error.message}`,
          error: error
        });
      } else {
        console.log("✅ Edge Function réussie:", data);
        setResult({
          success: data.success,
          message: data.success 
            ? `Email envoyé via ${data.method} ! Message ID: ${data.result?.messageId || 'N/A'}`
            : `Erreur: ${data.error}`,
          error: data.success ? null : data
        });
      }
    } catch (error: any) {
      console.error("💥 Erreur durant le test Edge Function:", error);
      setResult({
        success: false,
        message: `Erreur technique: ${error.message}`,
        error: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>🧪 Test SMTP Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Email de test
          </label>
          <Input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="votre.email@exemple.com"
          />
        </div>

        <div className="space-y-2">
          <Button 
            onClick={testPasswordReset}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading ? "Envoi..." : "Test Reset Password"}
          </Button>
          
          <Button 
            onClick={testSignUp}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading ? "Envoi..." : "Test Inscription"}
          </Button>

          <Button 
            onClick={testNodeJSEdgeFunction}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? "Envoi..." : "🚀 Test Node.js (Edge Function)"}
          </Button>
        </div>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            <AlertDescription>
              {result.message}
              {result.error && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Détails de l'erreur</summary>
                  <pre className="text-xs mt-1 overflow-auto">
                    {JSON.stringify(result.error, null, 2)}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
          <strong>Instructions :</strong>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Testez avec un email réel que vous contrôlez</li>
            <li>Le bouton vert utilise Node.js via Edge Function</li>
            <li>Vérifiez la console du navigateur</li>
            <li>Consultez les logs Supabase (Edge Functions)</li>
            <li>Vérifiez vos spams si le test réussit</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default SMTPTestComponent;
