
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ConfigurationInstructions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Hostinger pour directivesplus.fr</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Étape 1: Créer l'adresse email</h4>
            <p className="text-sm text-blue-800">
              Dans votre panneau Hostinger → Email → Comptes Email → Créer l'adresse <code>noreply@directivesplus.fr</code>
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Étape 2: Configuration SMTP dans Supabase</h4>
            <p className="text-sm text-green-800 mb-2">
              Dashboard Supabase → Authentication → Settings → SMTP Settings :
            </p>
            <div className="bg-white p-3 rounded border text-sm font-mono">
              <div>• Host: <strong>smtp.hostinger.com</strong></div>
              <div>• Port: <strong>587</strong></div>
              <div>• Username: <strong>noreply@directivesplus.fr</strong></div>
              <div>• Password: <strong>[mot de passe de l'email]</strong></div>
              <div>• Sender Name: <strong>DirectivesPlus</strong></div>
              <div>• Sender Email: <strong>noreply@directivesplus.fr</strong></div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Étape 3: URLs de redirection</h4>
            <p className="text-sm text-yellow-800 mb-2">
              Dans Authentication → URL Configuration :
            </p>
            <div className="bg-white p-3 rounded border text-sm">
              <div>• Site URL: <strong>https://directivesplus.fr</strong></div>
              <div>• Redirect URLs: <strong>https://directivesplus.fr/auth</strong></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
