
import React, { useState, useEffect } from 'react';
import { SecureDocumentAccess } from '@/utils/security/secureDocumentAccess';
import { EnhancedSecurityEventLogger } from '@/utils/security/enhancedSecurityEventLogger';
import { useSecureRateLimit } from '@/hooks/useSecureRateLimit';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface SecureDocumentViewerProps {
  documentId: string;
  accessCode?: string;
  onAccessGranted?: (documentData: any) => void;
  onAccessDenied?: (error: string) => void;
}

export const SecureDocumentViewer: React.FC<SecureDocumentViewerProps> = ({
  documentId,
  accessCode,
  onAccessGranted,
  onAccessDenied
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<any>(null);

  const { isBlocked, remainingAttempts, checkRateLimit, recordSuccess } = useSecureRateLimit(
    `document_access_${documentId}`,
    'document_access',
    { maxAttempts: 3, windowMinutes: 15 }
  );

  const getClientInfo = () => ({
    ipAddress: null, // In a real app, this would be obtained from the server
    userAgent: navigator.userAgent
  });

  const validateAccess = async () => {
    if (isBlocked) {
      setError(`Trop de tentatives. ${remainingAttempts} tentatives restantes.`);
      return;
    }

    setLoading(true);
    setError(null);

    const clientInfo = getClientInfo();
    
    // Check rate limit first
    const rateLimitPassed = await checkRateLimit(
      clientInfo.ipAddress,
      clientInfo.userAgent
    );

    if (!rateLimitPassed) {
      setError('Trop de tentatives. Veuillez patienter avant de réessayer.');
      setLoading(false);
      return;
    }

    try {
      const result = await SecureDocumentAccess.validateAccess(
        documentId,
        accessCode,
        user?.id,
        clientInfo.ipAddress,
        clientInfo.userAgent
      );

      if (result.accessGranted && result.documentData) {
        setDocumentData(result.documentData);
        await recordSuccess(clientInfo.ipAddress, clientInfo.userAgent);
        
        await EnhancedSecurityEventLogger.logDocumentAccess(
          documentId,
          true,
          user?.id,
          accessCode ? 'access_code' : 'user_ownership',
          clientInfo.ipAddress,
          clientInfo.userAgent
        );

        onAccessGranted?.(result.documentData);
      } else {
        setError(result.errorMessage || 'Accès refusé');
        onAccessDenied?.(result.errorMessage || 'Accès refusé');
      }
    } catch (error) {
      console.error('Document access validation error:', error);
      setError('Erreur lors de la validation de l\'accès');
      onAccessDenied?.('Erreur de validation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      validateAccess();
    }
  }, [documentId, accessCode, user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Validation de l'accès sécurisé...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>{error}</p>
            {!isBlocked && (
              <Button
                onClick={validateAccess}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                Réessayer
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (documentData) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Accès autorisé au document: <strong>{documentData.fileName}</strong>
          </AlertDescription>
        </Alert>
        
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-2">Document sécurisé</h3>
          <p className="text-gray-600 mb-4">
            Nom: {documentData.fileName}
          </p>
          <p className="text-gray-600 mb-4">
            Type: {documentData.contentType}
          </p>
          
          {/* Here you would integrate with your document viewer component */}
          <div className="text-sm text-gray-500">
            Document validé et prêt à être consulté de manière sécurisée.
          </div>
        </div>
      </div>
    );
  }

  return null;
};
