
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SimpleValidationService } from "@/services/accessCode/simpleValidation";
import { supabase } from "@/integrations/supabase/client";

export const AccessCodeDiagnostic: React.FC = () => {
  const [accessCode, setAccessCode] = useState("SA476FAE");
  const [firstName, setFirstName] = useState("FARID");
  const [lastName, setLastName] = useState("AREZKI");
  const [birthDate, setBirthDate] = useState("1963-08-13");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      console.log("=== DÉBUT DIAGNOSTIC COMPLET ===");
      
      const diagnosticResults = [];
      
      // 1. Vérifier les données en base
      console.log("🔍 1. Vérification shared_documents");
      const { data: sharedDocs, error: sharedError } = await supabase
        .from('shared_documents')
        .select('*')
        .eq('access_code', accessCode);
      
      diagnosticResults.push({
        step: "1. shared_documents",
        found: sharedDocs?.length || 0,
        data: sharedDocs,
        error: sharedError?.message
      });
      
      // 2. Vérifier user_profiles
      console.log("🔍 2. Vérification user_profiles");
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('institution_shared_code', accessCode);
      
      diagnosticResults.push({
        step: "2. user_profiles",
        found: profiles?.length || 0,
        data: profiles,
        error: profilesError?.message
      });
      
      // 3. Vérifier shared_profiles
      console.log("🔍 3. Vérification shared_profiles");
      const { data: sharedProfiles, error: sharedProfilesError } = await supabase
        .from('shared_profiles')
        .select('*')
        .eq('access_code', accessCode);
      
      diagnosticResults.push({
        step: "3. shared_profiles",
        found: sharedProfiles?.length || 0,
        data: sharedProfiles,
        error: sharedProfilesError?.message
      });
      
      // 4. Test validation simplifiée
      console.log("🔍 4. Test validation simplifiée");
      const validationResult = await SimpleValidationService.validateAccessCode(accessCode, {
        firstName,
        lastName,
        birthDate
      });
      
      diagnosticResults.push({
        step: "4. Validation simplifiée",
        found: validationResult.success ? 1 : 0,
        data: validationResult,
        error: validationResult.success ? null : validationResult.error
      });
      
      setResults(diagnosticResults);
      console.log("=== DIAGNOSTIC TERMINÉ ===", diagnosticResults);
      
    } catch (error: any) {
      console.error("Erreur diagnostic:", error);
      setResults([{
        step: "Erreur générale",
        found: 0,
        data: null,
        error: error.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  const createTestData = async () => {
    setLoading(true);
    
    try {
      console.log("🔧 Création données de test");
      
      // Créer un profil de test
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: '5a476fae-7295-435a-80e2-25532e9dda8a', // ID existant d'après les logs
          first_name: 'FARID',
          last_name: 'AREZKI',
          birth_date: '1963-08-13',
          institution_shared_code: 'SA476FAE'
        })
        .select()
        .single();
      
      console.log("👤 Profil créé:", { profile, profileError });
      
      // Créer un document partagé de test
      const { data: sharedDoc, error: sharedError } = await supabase
        .from('shared_documents')
        .upsert({
          access_code: 'SA476FAE',
          user_id: '5a476fae-7295-435a-80e2-25532e9dda8a',
          document_type: 'test',
          document_data: {
            documents: [
              {
                id: 'test-doc-1',
                file_name: 'Test Document.pdf',
                content_type: 'application/pdf',
                user_id: '5a476fae-7295-435a-80e2-25532e9dda8a'
              }
            ]
          },
          document_id: '00000000-0000-0000-0000-000000000001',
          is_active: true,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours
        })
        .select();
      
      console.log("📄 Document partagé créé:", { sharedDoc, sharedError });
      
      alert("Données de test créées ! Relancez le diagnostic.");
      
    } catch (error: any) {
      console.error("Erreur création test:", error);
      alert("Erreur lors de la création des données de test: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Diagnostic du système de codes d'accès</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Code d'accès</Label>
            <Input value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
          </div>
          <div>
            <Label>Prénom</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <Label>Nom</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <Label>Date de naissance</Label>
            <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={runDiagnostic} disabled={loading}>
            {loading ? "Diagnostic..." : "🔍 Lancer le diagnostic"}
          </Button>
          <Button onClick={createTestData} disabled={loading} variant="outline">
            🔧 Créer données de test
          </Button>
        </div>
        
        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Résultats du diagnostic :</h3>
            {results.map((result, index) => (
              <Alert key={index} variant={result.error ? "destructive" : "default"}>
                <AlertDescription>
                  <strong>{result.step}</strong>: {result.found} résultat(s)
                  {result.error && <div className="text-red-600">Erreur: {result.error}</div>}
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm">Voir les détails</summary>
                      <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
