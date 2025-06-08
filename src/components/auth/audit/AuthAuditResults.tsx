
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react";

interface AuthAuditResult {
  category: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  recommendation?: string;
}

interface AuthAuditResultsProps {
  auditResults: AuthAuditResult[];
  isRunning: boolean;
  onRunAudit: () => void;
}

const AuthAuditResults = ({ auditResults, isRunning, onRunAudit }: AuthAuditResultsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800", 
      error: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Audit du Système d'Authentification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Button onClick={onRunAudit} disabled={isRunning}>
            {isRunning ? "Audit en cours..." : "Relancer l'audit"}
          </Button>
        </div>

        <div className="space-y-4">
          {auditResults.map((result, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.category}</span>
                </div>
                {getStatusBadge(result.status)}
              </div>
              <p className="text-gray-700 mb-2">{result.message}</p>
              {result.recommendation && (
                <Alert>
                  <AlertDescription>
                    <strong>Recommandation:</strong> {result.recommendation}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthAuditResults;
