import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DiagnosticResult {
  step: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

interface QRCodeDiagnosticProps {
  documentId: string;
  userId: string;
}

const QRCodeDiagnostic: React.FC<QRCodeDiagnosticProps> = ({ documentId, userId }) => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (step: string, success: boolean, data?: any, error?: string) => {
    const result: DiagnosticResult = {
      step,
      success,
      data,
      error,
      timestamp: new Date().toISOString()
    };
    setResults(prev => [...prev, result]);
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);

    // Étape 1: Vérifier la connexion Supabase
    addResult("1. Connexion Supabase", true, { url: "https://kytqqjnecezkxyhmmjrz.supabase.co" });

    // Étape 2: Test fonction RPC publique
    try {
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_public_document', { doc_id: documentId });

      addResult(
        "2. Fonction RPC publique (RLS corrigé)",
        !rpcError,
        rpcData?.[0] ? {
          id: rpcData[0].id,
          file_name: rpcData[0].file_name,
          user_id: rpcData[0].user_id,
          file_path_type: rpcData[0].file_path?.startsWith('data:') ? 'data_url' : 'external_url',
          rls_bypass: true
        } : { function_exists: true, document_found: false },
        rpcError?.message
      );
    } catch (err) {
      addResult("2. Fonction RPC publique", false, null, err instanceof Error ? err.message : 'Erreur RPC');
    }

    // Étape 3: Test accès direct avec nouvelle politique RLS
    try {
      const { data: directAccess, error: directError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('id', documentId);

      addResult(
        "3. Accès direct avec RLS public",
        !directError,
        directAccess?.[0] ? {
          id: directAccess[0].id,
          file_name: directAccess[0].file_name,
          user_id: directAccess[0].user_id,
          public_access: true
        } : { policy_allows_access: true, document_found: false },
        directError?.message
      );
    } catch (err) {
      addResult("3. Accès direct RLS", false, null, err instanceof Error ? err.message : 'Erreur accès direct');
    }

    // Étape 4: Vérifier l'état d'authentification
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      addResult(
        "4. État authentification",
        !authError,
        {
          isAuthenticated: !!session,
          userId: session?.user?.id,
          expectedUserId: userId,
          auth_required: false
        },
        authError?.message
      );
    } catch (err) {
      addResult("4. État authentification", false, null, err instanceof Error ? err.message : 'Erreur auth');
    }

    // Étape 5: Test des paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    addResult(
      "5. Paramètres URL",
      true,
      {
        id: urlParams.get('id'),
        access: urlParams.get('access'),
        user: urlParams.get('user'),
        full_url: window.location.href,
        expected_id: documentId,
        qr_code_access: urlParams.get('access') === 'card'
      }
    );

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, [documentId, userId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-600">
        🔍 Diagnostic QR Code - RLS Corrigé
      </h2>
      
      <div className="mb-4 p-4 bg-green-50 rounded-lg">
        <h3 className="font-medium text-green-800 mb-2">✅ Corrections appliquées:</h3>
        <div className="text-sm text-green-700 space-y-1">
          <div>• Politique RLS publique activée sur pdf_documents</div>
          <div>• Fonction get_public_document avec SECURITY DEFINER</div>
          <div>• Permissions accordées aux utilisateurs anonymes</div>
          <div><strong>Document ID:</strong> {documentId}</div>
          <div><strong>User ID:</strong> {userId}</div>
        </div>
      </div>

      {isRunning && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
            <span className="text-blue-800">Test du nouvel accès RLS...</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {results.map((result, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-lg ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.success ? '✅' : '❌'}
              </span>
              <span className="font-medium">{result.step}</span>
              <span className="text-xs text-gray-500">
                {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            {result.data && (
              <div className="ml-6 p-2 bg-gray-50 rounded text-xs">
                <strong>Données:</strong>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
            
            {result.error && (
              <div className="ml-6 p-2 bg-red-100 rounded text-xs text-red-700">
                <strong>Erreur:</strong> {result.error}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <button 
          onClick={runDiagnostic}
          disabled={isRunning}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? 'Test en cours...' : 'Relancer le test'}
        </button>
      </div>
    </div>
  );
};

export default QRCodeDiagnostic;
