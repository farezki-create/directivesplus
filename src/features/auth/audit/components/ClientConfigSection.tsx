
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Info } from 'lucide-react';
import { EmailAuditResult } from '../types';

interface ClientConfigSectionProps {
  clientConfig: EmailAuditResult['clientConfig'];
}

export const ClientConfigSection: React.FC<ClientConfigSectionProps> = ({ clientConfig }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Configuration Client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>URL Supabase:</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {clientConfig.url}
            </code>
          </div>
          <div className="flex justify-between">
            <span>Clé Anon:</span>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {clientConfig.key}
            </code>
          </div>
          {clientConfig.issues.map((issue, index) => (
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
