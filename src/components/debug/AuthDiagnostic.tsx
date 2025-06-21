
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DiagnosticResult } from "./types";
import { DiagnosticService } from "./diagnosticService";
import DiagnosticResults from "./DiagnosticResults";

const AuthDiagnostic = () => {
  const [testEmail, setTestEmail] = useState("");
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostic = async () => {
    if (!testEmail) {
      alert("Veuillez saisir un email pour le test");
      return;
    }

    setIsLoading(true);
    setDiagnosticResults([]);

    try {
      const results = await DiagnosticService.runAllDiagnostics(testEmail);
      setDiagnosticResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Diagnostic Authentification OTP</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            Ce diagnostic teste l'envoi d'OTP via Supabase Auth pour identifier les problèmes.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
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
          
          <Button 
            onClick={runDiagnostic}
            disabled={isLoading || !testEmail}
            className="w-full"
          >
            {isLoading ? "Diagnostic en cours..." : "🚀 Lancer le diagnostic"}
          </Button>
        </div>

        <DiagnosticResults results={diagnosticResults} />

        <Alert>
          <AlertDescription>
            <strong>Interprétation :</strong><br/>
            • Si "Test envoi OTP" échoue avec une erreur 429 → Rate limiting actif<br/>
            • Si erreur SMTP → Configuration email Supabase à vérifier<br/>
            • Si tout passe → Le problème peut être côté réception email
          </AlertDescription>
        </Alert>
        
        <div className="text-sm space-y-1">
          <p><strong>Liens utiles :</strong></p>
          <p>• <a href="https://supabase.com/dashboard/project/kytqqjnecezkxyhmmjrz/auth/providers" target="_blank" className="text-blue-600 underline">Configuration Auth</a></p>
          <p>• <a href="https://supabase.com/dashboard/project/kytqqjnecezkxyhmmjrz/logs/auth-logs" target="_blank" className="text-blue-600 underline">Logs Auth</a></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDiagnostic;
