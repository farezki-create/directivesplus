
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import AppNavigation from "@/components/AppNavigation";
import DocumentUploader from "@/components/documents/DocumentUploader";
import AccessCodeDisplay from "@/components/documents/AccessCodeDisplay";
import { useAccessCode, generateAccessCode } from "@/hooks/useAccessCode";
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
  
  useEffect(() => {
    // If the user doesn't have a medical access code, generate one
    const ensureMedicalAccessCode = async () => {
      if (user && !accessCode) {
        try {
          console.log("Attempting to generate medical access code");
          const newCode = await generateAccessCode(user, "medical");
          if (newCode) {
            toast({
              title: "Code d'accès généré",
              description: "Un nouveau code d'accès pour vos données médicales a été généré.",
              duration: 5000
            });
          }
        } catch (error) {
          console.error("Error generating medical access code:", error);
        }
      }
    };
    
    if (isAuthenticated && !isLoading) {
      ensureMedicalAccessCode();
    }
  }, [user, accessCode, isAuthenticated, isLoading]);

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

  console.log("Medical page - Access code:", accessCode);
  console.log("Medical page - Profile:", profile);

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

          {/* Always display access code if available */}
          {accessCode && profile && (
            <div className="mt-4 mb-8">
              <AccessCodeDisplay 
                accessCode={accessCode}
                firstName={profile.first_name || ""}
                lastName={profile.last_name || ""}
                birthDate={profile.birth_date || ""}
                type="medical"
              />
            </div>
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
