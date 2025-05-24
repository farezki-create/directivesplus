
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

export const DatabaseDiagnostic = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    const results = [];

    try {
      // Test 1: Vérifier user_profiles
      const { data: userProfiles, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(5);
      
      results.push({
        test: "user_profiles",
        success: !userError,
        data: userProfiles,
        error: userError?.message
      });

      // Test 2: Vérifier shared_profiles
      const { data: sharedProfiles, error: sharedError } = await supabase
        .from('shared_profiles')
        .select('*')
        .limit(5);
      
      results.push({
        test: "shared_profiles",
        success: !sharedError,
        data: sharedProfiles,
        error: sharedError?.message
      });

      // Test 3: Vérifier directives
      const { data: directives, error: directivesError } = await supabase
        .from('directives')
        .select('*')
        .limit(5);
      
      results.push({
        test: "directives",
        success: !directivesError,
        data: directives,
        error: directivesError?.message
      });

      // Test 4: Recherche spécifique par code
      const { data: specificCode, error: specificError } = await supabase
        .from('shared_profiles')
        .select('*')
        .eq('access_code', 'TEST123');
      
      results.push({
        test: "Code TEST123",
        success: !specificError,
        data: specificCode,
        error: specificError?.message
      });

    } catch (error) {
      results.push({
        test: "Erreur générale",
        success: false,
        error: error.message
      });
    }

    setDiagnosticResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Diagnostic de la base de données</h2>
        <Button onClick={runDiagnostic} disabled={loading}>
          {loading ? "Analyse..." : "Relancer le diagnostic"}
        </Button>
      </div>

      {diagnosticResults.map((result, index) => (
        <Alert key={index} variant={result.success ? "default" : "destructive"}>
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex justify-between">
                <strong>{result.test}</strong>
                <span className={result.success ? "text-green-600" : "text-red-600"}>
                  {result.success ? "✓" : "✗"}
                </span>
              </div>
              
              {result.error && (
                <div className="text-red-600 text-sm">
                  Erreur: {result.error}
                </div>
              )}
              
              {result.data && (
                <details className="text-sm">
                  <summary className="cursor-pointer">Voir les données ({result.data.length} éléments)</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
