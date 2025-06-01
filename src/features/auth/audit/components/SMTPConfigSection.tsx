
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Info } from 'lucide-react';
import { EmailAuditResult } from '../types';

interface SMTPConfigSectionProps {
  smtpConfig: EmailAuditResult['smtpConfig'];
}

export const SMTPConfigSection: React.FC<SMTPConfigSectionProps> = ({ smtpConfig }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          Configuration SMTP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Fournisseur:</span>
            <span className="text-sm">{smtpConfig.provider}</span>
          </div>
          {smtpConfig.issues.map((issue, index) => (
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
