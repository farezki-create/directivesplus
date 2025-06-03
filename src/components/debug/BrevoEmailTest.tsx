
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export const BrevoEmailTest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testBrevoEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      console.log("🧪 Test envoi email Brevo pour:", email);
      
      const { data, error } = await supabase.functions.invoke('send-auth-email', {
        body: {
          email: email,
          type: 'signup',
          confirmation_url: `${window.location.origin}/auth?confirmed=true`,
          user_data: {
            first_name: 'Test',
            last_name: 'User'
          }
        }
      });

      if (error) {
        console.error("❌ Erreur test Brevo:", error);
        setResult({
          success: false,
          error: error.message,
          details: error
        });
      } else {
        console.log("✅ Test Brevo réussi:", data);
        setResult({
          success: true,
          data: data,
          message: "Email de test envoyé avec succès !"
        });
      }

    } catch (error: any) {
      console.error("💥 Erreur critique test Brevo:", error);
      setResult({
        success: false,
        error: error.message,
        details: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Test Email Brevo</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="test-email">Email de test</Label>
        <Input
          id="test-email"
          type="email"
          placeholder="test@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={testBrevoEmail}
        disabled={!email || loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Envoyer email de test
          </>
        )}
      </Button>
      
      {result && (
        <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
            <div className="space-y-2">
              <p className="font-medium">
                {result.success ? "✅ Succès" : "❌ Erreur"}
              </p>
              <p>{result.message || result.error}</p>
              {result.details && (
                <details className="text-xs">
                  <summary>Détails techniques</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-gray-600">
        <p><strong>Instructions :</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Saisissez votre adresse email</li>
          <li>Cliquez sur "Envoyer email de test"</li>
          <li>Vérifiez votre boîte de réception ET vos spams</li>
          <li>L'email devrait arriver de contact@directivesplus.fr</li>
        </ul>
      </div>
    </div>
  );
};
