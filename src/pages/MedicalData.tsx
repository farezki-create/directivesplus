
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { toast } from "@/hooks/use-toast";
import DocumentCard from "@/components/documents/DocumentCard";
import EmptyDocumentsState from "@/components/documents/EmptyDocumentsState";
import DocumentUploader from "@/components/documents/DocumentUploader";
import AccessCodeDisplay from "@/components/documents/AccessCodeDisplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  user_id: string;
}

const MedicalData = () => {
  const { user, isAuthenticated, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/donnees-medicales" } });
    } else if (isAuthenticated && user) {
      fetchDocuments();
      fetchAccessCode();
    }
  }, [isAuthenticated, isLoading, user]);

  const fetchAccessCode = async () => {
    if (!user) return;
    
    try {
      // Check if user profile has a medical access code
      if (profile?.medical_access_code) {
        setAccessCode(profile.medical_access_code);
        return;
      }
      
      // Generate a new access code if none exists
      const accessCode = generateRandomCode(8);
      
      // Update the profile with the new access code
      const { error } = await supabase
        .from('profiles')
        .update({ medical_access_code: accessCode })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setAccessCode(accessCode);
    } catch (error) {
      console.error("Erreur lors de la récupération du code d'accès:", error);
    }
  };
  
  const generateRandomCode = (length: number) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const fetchDocuments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos documents médicaux",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      // Pour les fichiers audio, afficher dans une boîte de dialogue
      if (filePath.includes('audio')) {
        setPreviewDocument(filePath);
        return;
      }
      
      // Pour les PDF et autres documents, télécharger et ouvrir
      const link = document.createElement('a');
      link.href = filePath;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Document ouvert",
        description: "Votre document a été ouvert dans un nouvel onglet"
      });
    } catch (error) {
      console.error("Erreur lors de l'ouverture du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (filePath: string, contentType: string = "application/pdf") => {
    try {
      if (filePath.startsWith('data:') && filePath.includes('audio')) {
        toast({
          title: "Information",
          description: "L'impression n'est pas disponible pour les fichiers audio."
        });
        return;
      }
      
      // Ouvrir le document dans un nouvel onglet pour impression
      const printWindow = window.open(filePath, '_blank');
      if (printWindow) {
        printWindow.focus();
        // Attendre que le contenu soit chargé avant d'imprimer
        printWindow.onload = () => {
          try {
            printWindow.print();
          } catch (err) {
            console.error("Erreur lors de l'impression:", err);
          }
        };
      } else {
        throw new Error("Impossible d'ouvrir une nouvelle fenêtre");
      }
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le document",
        variant: "destructive"
      });
    }
  };

  const handleShare = (documentId: string) => {
    // À implémenter: fonctionnalité pour partager le document
    toast({
      title: "Fonctionnalité en développement",
      description: "Le partage de document sera bientôt disponible"
    });
  };
  
  const handleView = (filePath: string, contentType: string = "application/pdf") => {
    handleDownload(filePath, "document");
  };
  
  const confirmDelete = (documentId: string) => {
    setDocumentToDelete(documentId);
  };
  
  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentToDelete);
      
      if (error) throw error;
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
      
      // Rafraîchir la liste des documents
      fetchDocuments();
    } catch (error: any) {
      console.error("Erreur lors de la suppression du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  const handleUploadComplete = () => {
    fetchDocuments();
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Données Médicales</h1>
            <Button
              onClick={() => setShowAddOptions(!showAddOptions)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Ajouter un document
            </Button>
          </div>

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
          
          {documents.length === 0 ? (
            <EmptyDocumentsState message="Vous n'avez pas encore ajouté de données médicales" />
          ) : (
            <div className="grid gap-6">
              {documents.map((doc) => (
                <DocumentCard 
                  key={doc.id}
                  document={doc}
                  onDownload={handleDownload}
                  onPrint={() => handlePrint(doc.file_path, doc.content_type)}
                  onShare={handleShare}
                  onView={handleView}
                  onDelete={confirmDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Prévisualisation audio</DialogTitle>
            <DialogDescription>
              Écoutez votre enregistrement audio
            </DialogDescription>
          </DialogHeader>
          {previewDocument && previewDocument.includes('audio') && (
            <audio className="w-full" controls src={previewDocument} />
          )}
        </DialogContent>
      </Dialog>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default MedicalData;
