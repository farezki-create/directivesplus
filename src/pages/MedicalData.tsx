
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import DocumentUploader from "@/components/documents/DocumentUploader";
import MedicalHeader from "@/components/medical/MedicalHeader";
import MedicalDocumentList from "@/components/medical/MedicalDocumentList";
import MedicalDocumentActions, { useMedicalDocumentActions } from "@/components/medical/MedicalDocumentActions";
import { useMedicalDocuments } from "@/hooks/useMedicalDocuments";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MedicalData = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [showAddOptions, setShowAddOptions] = useState(false);
  
  const {
    documents,
    loading,
    fetchDocuments,
    handleUploadComplete
  } = useMedicalDocuments(user);

  const documentActions = useMedicalDocumentActions({
    onDeleteComplete: fetchDocuments
  });

  // Show loading state while auth is loading
  if (isLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  console.log("Medical page - Auth state:", { userId: user?.id, hasProfile: !!profile, isAuthenticated });

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour à l'accueil
            </Button>
          </div>
          
          <MedicalHeader onAddDocument={() => setShowAddOptions(!showAddOptions)} />

          {!isAuthenticated && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Pour accéder à vos données médicales, vous devez être connecté ou utiliser un code d'accès médical.
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-2"
                  onClick={() => navigate("/medical-access")}
                >
                  Accéder avec un code
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isAuthenticated && documents.length > 0 && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Vous pouvez transférer vos documents médicaux vers vos directives anticipées 
                pour qu'ils soient accessibles via un code d'accès aux professionnels de santé.
              </AlertDescription>
            </Alert>
          )}

          {isAuthenticated && showAddOptions && user && (
            <div className="mb-8">
              <DocumentUploader 
                userId={user.id}
                onUploadComplete={handleUploadComplete}
                documentType="medical"
              />
            </div>
          )}
          
          {isAuthenticated ? (
            <MedicalDocumentList
              documents={documents}
              onDownload={documentActions.handleDownload}
              onPrint={documentActions.handlePrint}
              onView={documentActions.handleView}
              onDelete={documentActions.confirmDelete}
              onVisibilityChange={documentActions.handleVisibilityChange}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Connectez-vous pour voir vos documents médicaux ou utilisez un code d'accès.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/auth")}>
                  Se connecter
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/medical-access")}
                >
                  Accès avec code
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {isAuthenticated && (
        <MedicalDocumentActions
          {...documentActions}
        />
      )}
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default MedicalData;
