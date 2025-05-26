
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, RefreshCw, Search, Home } from "lucide-react";

interface ErrorStateProps {
  error: string | null;
  onRetry: () => void;
  onGoBack: () => void;
  retryCount: number;
  documentId?: string | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onGoBack, retryCount, documentId }) => {
  const isDocumentNotFound = error?.includes('introuvable') || error?.includes('not found');
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Document non trouvé'}
          </AlertDescription>
        </Alert>
        
        {isDocumentNotFound && documentId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">
              🔍 Document introuvable
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Le document avec l'ID <code className="bg-blue-100 px-1 rounded">{documentId}</code> n'a pas été trouvé dans la base de données.
            </p>
            <p className="text-sm text-blue-600">
              <strong>Causes possibles :</strong>
            </p>
            <ul className="text-sm text-blue-600 list-disc list-inside ml-2">
              <li>Le document a été supprimé</li>
              <li>L'ID dans le QR code est incorrect</li>
              <li>Vous n'avez pas les permissions d'accès</li>
              <li>Le lien a expiré</li>
            </ul>
          </div>
        )}
        
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={onGoBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <Button 
            variant="outline"
            onClick={onRetry}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
          
          <Button 
            variant="default"
            onClick={() => window.location.href = '/mes-directives'}
          >
            <Home className="w-4 h-4 mr-2" />
            Mes directives
          </Button>
          
          {isDocumentNotFound && (
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/mes-directives'}
            >
              <Search className="w-4 h-4 mr-2" />
              Parcourir mes documents
            </Button>
          )}
        </div>
        
        {documentId && (
          <div className="mt-6 text-xs text-gray-500">
            <strong>ID du document :</strong> {documentId}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
