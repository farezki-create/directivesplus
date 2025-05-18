
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import DocumentUploader from "@/components/documents/DocumentUploader";
import AccessCodeDisplay from "@/components/documents/AccessCodeDisplay";
import { useAccessCode } from "@/hooks/useAccessCode";
import MedicalHeader from "@/components/medical/MedicalHeader";
import MedicalDocumentList from "@/components/medical/MedicalDocumentList";
import MedicalDocumentActions, { useMedicalDocumentActions } from "@/components/medical/MedicalDocumentActions";
import { useMedicalDocuments } from "@/hooks/useMedicalDocuments";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MedicalData = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [showAddOptions, setShowAddOptions] = useState(false);
  const accessCode = useAccessCode(user, "medical");
  
  const {
    documents,
    loading,
    fetchDocuments,
    handleUploadComplete
  } = useMedicalDocuments(user);

  const documentActions = useMedicalDocumentActions({
    onDeleteComplete: fetchDocuments
  });
  
  console.log("MedicalData - documentActions.previewDocument:", documentActions.previewDocument);
  console.log("MedicalData - documents:", documents);
  
  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    navigate("/auth", { state: { from: "/donnees-medicales" } });
    return null;
  }

  if (isLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour au tableau de bord
            </Button>
          </div>
          
          <MedicalHeader onAddDocument={() => setShowAddOptions(!showAddOptions)} />

          {accessCode && profile && (
            <AccessCodeDisplay 
              accessCode={accessCode}
              firstName={profile.first_name || ""}
              lastName={profile.last_name || ""}
              birthDate={profile.birth_date || ""}
              type="medical"
            />
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
        handleDownload={documentActions.handleDownload}
        handlePrint={documentActions.handlePrint}
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
