
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Server, XCircle } from 'lucide-react';
import { EmailAuditResult } from '../types';

interface TestResultsSectionProps {
  testResults: EmailAuditResult['testResults'];
}

export const TestResultsSection: React.FC<TestResultsSectionProps> = ({ testResults }) => {
  const getStatusBadge = (status: boolean, trueText = 'OK', falseText = 'Erreur') => {
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
          <Server className="mr-2 h-5 w-5" />
          Résultats des Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Test de connexion:</span>
            {getStatusBadge(testResults.connectionTest)}
          </div>
          <div className="flex justify-between">
            <span>Test d'inscription:</span>
            {getStatusBadge(testResults.signupTest)}
          </div>
          <div className="flex justify-between">
            <span>Test email:</span>
            {getStatusBadge(testResults.emailTest)}
          </div>
          {testResults.errors.map((error, index) => (
            <Alert key={index} variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
