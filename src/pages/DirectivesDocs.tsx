
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import refactored components
import DirectivesPageHeader from "@/components/documents/DirectivesPageHeader";
import DirectivesDocumentList from "@/components/documents/DirectivesDocumentList";
import DirectivesAddDocumentSection from "@/components/documents/DirectivesAddDocumentSection";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import DeleteConfirmationDialog from "@/components/documents/DeleteConfirmationDialog";
import AccessCodeDisplay from "@/components/documents/AccessCodeDisplay";

// Import custom hooks
import { useDocumentOperations } from "@/hooks/useDocumentOperations";
import { useAccessCode } from "@/hooks/useAccessCode";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  user_id: string;
  is_private?: boolean;
}

const DirectivesDocs = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false);

  // Custom hooks
  const accessCode = useAccessCode(user, "directive");
  const {
    previewDocument,
    setPreviewDocument,
    documentToDelete,
    setDocumentToDelete,
    handleDownload,
    handlePrint,
    handleShare,
    handleView,
    confirmDelete,
    handleDelete
  } = useDocumentOperations(fetchDocuments);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/mes-directives" } });
    } else if (isAuthenticated && user) {
      fetchDocuments();
    }
  }, [isAuthenticated, isLoading, user]);

  async function fetchDocuments() {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const handleUploadComplete = (url: string, fileName: string, isPrivate: boolean) => {
    fetchDocuments();
  };
  
  // Fonctions spécifiques pour le dialogue de prévisualisation
  const handlePreviewDownload = (filePath: string) => {
    const fileName = filePath.split('/').pop() || 'document';
    handleDownload(filePath, fileName);
  };

  const handlePreviewPrint = (filePath: string) => {
    // Déterminer le type de contenu basé sur l'extension du fichier
    let contentType = "application/pdf";
    if (filePath.includes('.jpg') || filePath.includes('.jpeg') || filePath.includes('.png')) {
      contentType = "image/jpeg";
    }
    handlePrint(filePath, contentType);
  };

  if (isLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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
          
          <DirectivesPageHeader 
            onAddDocument={() => setShowAddOptions(!showAddOptions)} 
          />

          {accessCode && profile && (
            <AccessCodeDisplay 
              accessCode={accessCode}
              firstName={profile.first_name || ""}
              lastName={profile.last_name || ""}
              birthDate={profile.birth_date || ""}
              type="directive"
            />
          )}

          {showAddOptions && user && (
            <DirectivesAddDocumentSection 
              userId={user.id}
              onUploadComplete={handleUploadComplete}
            />
          )}
          
          <DirectivesDocumentList 
            documents={documents}
            onDownload={handleDownload}
            onPrint={handlePrint}
            onShare={handleShare}
            onView={handleView}
            onDelete={confirmDelete}
          />
        </div>
      </main>
      
      <DeleteConfirmationDialog
        documentId={documentToDelete}
        onOpenChange={() => setDocumentToDelete(null)}
        onConfirmDelete={handleDelete}
      />

      <DocumentPreviewDialog
        filePath={previewDocument}
        onOpenChange={() => setPreviewDocument(null)}
        onDownload={handlePreviewDownload}
        onPrint={handlePreviewPrint}
      />
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default DirectivesDocs;
