
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw } from 'lucide-react';

interface AuditLoadingStateProps {
  loading: boolean;
  onStartAudit: () => void;
}

export const AuditLoadingState: React.FC<AuditLoadingStateProps> = ({ 
  loading, 
  onStartAudit 
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2">Audit en cours...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Audit non disponible</p>
          <Button onClick={onStartAudit}>
            <Shield className="mr-2 h-4 w-4" />
            Lancer l'audit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
