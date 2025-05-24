
import { useState } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import EmptyDocumentsState from "@/components/documents/EmptyDocumentsState";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  file_type?: string;
  user_id: string;
  is_private?: boolean; // This is for UI purposes only
}

interface MedicalDocumentListProps {
  documents: Document[];
  loading?: boolean; // Add loading prop
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, fileType?: string) => void;
  onView: (filePath: string, fileType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  documentToDelete?: string | null; // Make optional
  setDocumentToDelete?: (id: string | null) => void; // Make optional
  confirmDelete?: (id: string) => void; // Make optional
}

const MedicalDocumentList = ({
  documents,
  loading = false,
  onDownload,
  onPrint,
  onView,
  onDelete,
  onVisibilityChange,
  documentToDelete,
  setDocumentToDelete,
  confirmDelete
}: MedicalDocumentListProps) => {
  const [sendingToDirectives, setSendingToDirectives] = useState<string | null>(null);

  const handleSendToDirectives = async (document: Document) => {
    setSendingToDirectives(document.id);
    
    try {
      // Copy the document to the pdf_documents table (directives table)
      const { error } = await supabase
        .from('pdf_documents')
        .insert({
          file_name: document.file_name,
          file_path: document.file_path,
          description: `Document médical transféré: ${document.description || document.file_name}`,
          file_type: document.file_type,
          user_id: document.user_id,
          is_private: false // Make it accessible with access code
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Document transféré",
        description: `${document.file_name} a été ajouté à vos directives et sera accessible avec un code d'accès`,
      });
    } catch (error: any) {
      console.error("Erreur lors du transfert vers les directives:", error);
      toast({
        title: "Erreur",
        description: "Impossible de transférer le document vers les directives",
        variant: "destructive"
      });
    } finally {
      setSendingToDirectives(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return <EmptyDocumentsState message="Vous n'avez pas encore ajouté de données médicales" />;
  }

  return (
    <div className="grid gap-6">
      {documents.map((doc) => (
        <div key={doc.id} className="border rounded-lg p-6 bg-white">
          <DocumentCard 
            document={doc}
            onDownload={onDownload}
            onPrint={onPrint}
            onView={onView}
            onDelete={onDelete}
            onVisibilityChange={onVisibilityChange}
          />
          
          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={() => handleSendToDirectives(doc)}
              disabled={sendingToDirectives === doc.id}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FolderPlus size={16} />
              {sendingToDirectives === doc.id ? 
                "Envoi en cours..." : 
                "Envoyer vers mes directives"
              }
            </Button>
            <p className="text-xs text-gray-500 mt-1">
              Le document sera accessible via code d'accès dans vos directives
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicalDocumentList;
