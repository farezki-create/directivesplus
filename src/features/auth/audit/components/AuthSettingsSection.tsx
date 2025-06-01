
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Info } from 'lucide-react';
import { EmailAuditResult } from '../types';

interface AuthSettingsSectionProps {
  authSettings: EmailAuditResult['authSettings'];
}

export const AuthSettingsSection: React.FC<AuthSettingsSectionProps> = ({ authSettings }) => {
  const getStatusBadge = (status: boolean, trueText = 'Activé', falseText = 'Désactivé') => {
    return (
      <Badge variant={status ? 'default' : 'destructive'}>
        {status ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Paramètres Authentification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Confirmation Email:</span>
            {getStatusBadge(authSettings.confirmEmail)}
          </div>
          <div className="flex justify-between">
            <span>Site URL actuel:</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {authSettings.siteUrl}
            </code>
          </div>
          {authSettings.issues.map((issue, index) => (
            <Alert key={index}>
              <Info className="h-4 w-4" />
              <AlertDescription>{issue}</AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
