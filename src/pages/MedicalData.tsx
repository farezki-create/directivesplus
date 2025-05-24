
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

  // Handle redirect for non-authenticated users in useEffect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to auth page");
      navigate("/auth", { state: { from: "/donnees-medicales" } });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state while auth is loading
  if (isLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  console.log("Medical page - Auth state:", { userId: user?.id, hasProfile: !!profile });

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

          {documents.length > 0 && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Vous pouvez transférer vos documents médicaux vers vos directives anticipées 
                pour qu'ils soient accessibles via un code d'accès aux professionnels de santé.
              </AlertDescription>
            </Alert>
          )}

          {showAddOptions && user && (
            <div className="mb-8">
              <DocumentUploader 
                userId={user.id}
                onUploadComplete={handleUploadComplete}
                documentType="medical"
              />
            </div>
          )}
          
          <MedicalDocumentList
            documents={documents}
            onDownload={documentActions.handleDownload}
            onPrint={documentActions.handlePrint}
            onView={documentActions.handleView}
            onDelete={documentActions.confirmDelete}
            onVisibilityChange={documentActions.handleVisibilityChange}
          />
        </div>
      </main>
      
      <MedicalDocumentActions
        {...documentActions}
      />
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default MedicalData;
