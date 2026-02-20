
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EmailTestSectionProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const EmailTestSection: React.FC<EmailTestSectionProps> = ({ loading, setLoading }) => {
  const [testEmail, setTestEmail] = React.useState('');

  const testEmailWithRealAddress = async () => {
    if (!testEmail) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) {
        console.error('❌ Erreur test email:', error);
        if (error.message.includes('SMTP')) {
          alert('Erreur SMTP: Configurez les paramètres SMTP dans le Dashboard Supabase');
        } else {
          alert(`Erreur: ${error.message}`);
        }
      } else {
        alert('Email de test envoyé ! Vérifiez votre boîte de réception et les spams.');
      }
      
    } catch (error: any) {
      console.error('💥 Erreur test email:', error);
      alert(`Erreur technique: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test avec Email Réel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Votre email (pour test)
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="votre.email@exemple.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <Button 
            onClick={testEmailWithRealAddress}
            disabled={!testEmail || loading}
            className="w-full"
          >
            {loading ? "Envoi..." : "Tester l'envoi d'email"}
          </Button>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Ce test enverra un vrai email de confirmation à l'adresse fournie.
              Vérifiez votre boîte de réception ET vos spams.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};
