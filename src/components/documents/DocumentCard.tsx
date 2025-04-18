
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Eye, FileIcon, Printer, Share2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { PDFStorageService } from "@/utils/storage/PDFStorageService";
import { Document } from "@/components/documents/types";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DocumentCardProps {
  document: Document;
  onPreview: (document: Document) => void;
  selectedDocumentId?: string | null;
  sharingCode: string | null;
  isAuthenticated: boolean;
  onDelete?: (documentId: string) => void;
}

export function DocumentCard({ 
  document, 
  onPreview, 
  selectedDocumentId, 
  sharingCode, 
  isAuthenticated, 
  onDelete 
}: DocumentCardProps) {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePreview = async () => {
    try {
      console.log("Prévisualisation du document:", document.file_name);
      
      // Check if we have a bucket-based storage path
      if (document.file_path && document.file_path.includes('/')) {
        const bucket = document.file_path.split('/')[0] === document.file_path 
          ? 'directives_pdfs' // Default bucket if no slash in path
          : document.file_path.split('/')[0];
          
        const path = document.file_path.includes('/') 
          ? document.file_path.substring(document.file_path.indexOf('/') + 1) 
          : document.file_path;
        
        console.log(`Accessing file in bucket: ${bucket}, path: ${path}`);
        
        // Get a signed URL for the document
        const { data, error } = await supabase
          .storage
          .from(bucket)
          .createSignedUrl(path, 3600); // 1 hour expiry
          
        if (error) {
          console.error("Error getting signed URL:", error);
          throw error;
        }
        
        if (data && data.signedUrl) {
          console.log("Signed URL obtained successfully");
          onPreview({ ...document, file_path: data.signedUrl });
          return;
        }
      }
      
      // Fallback for direct file paths or if signed URL failed
      onPreview(document);
    } catch (error) {
      console.error("Error getting document preview URL:", error);
      toast({
        title: "Erreur",
        description: "Impossible de prévisualiser le document. Vérifiez qu'il existe toujours dans le stockage.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      // Handle special case for cards with "cards/" in the path
      if (document.file_path && document.file_path.includes('cards/')) {
        // For cards, we'll use a different approach
        const fileName = document.file_path.split('/').pop() || document.file_name;
        
        // Create a download link directly with the file_name
        const a = window.document.createElement('a');
        a.href = `${window.location.origin}/download/${fileName}`;
        a.download = fileName;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        
        toast({
          title: "Téléchargement démarré",
          description: "Le document va être téléchargé"
        });
        return;
      }
      
      // Regular Supabase storage approach for non-card documents
      if (document.file_path && document.file_path.includes('/')) {
        const bucket = document.file_path.split('/')[0] === document.file_path 
          ? 'directives_pdfs' 
          : document.file_path.split('/')[0];
          
        const path = document.file_path.includes('/') 
          ? document.file_path.substring(document.file_path.indexOf('/') + 1) 
          : document.file_path;
        
        // Get download URL from Supabase storage
        const { data, error } = await supabase
          .storage
          .from(bucket)
          .createSignedUrl(path, 60);
          
        if (error) {
          console.error("Error creating signed URL:", error);
          throw error;
        }
        
        if (data && data.signedUrl) {
          // Use the signed URL to download the file
          const a = window.document.createElement('a');
          a.href = data.signedUrl;
          a.download = document.file_name;
          window.document.body.appendChild(a);
          a.click();
          window.document.body.removeChild(a);
          
          toast({
            title: "Téléchargement démarré",
            description: "Le document va être téléchargé"
          });
          return;
        }
      }
      
      // Fallback for direct file paths or other storage mechanisms
      toast({
        title: "Erreur",
        description: "Impossible de télécharger ce type de document directement",
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document. Vérifiez qu'il existe toujours dans le stockage.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = async () => {
    try {
      if (document.file_path && document.file_path.includes('/')) {
        const bucket = document.file_path.split('/')[0] === document.file_path 
          ? 'directives_pdfs' 
          : document.file_path.split('/')[0];
          
        const path = document.file_path.includes('/') 
          ? document.file_path.substring(document.file_path.indexOf('/') + 1) 
          : document.file_path;
        
        // Get download URL from Supabase storage
        const { data, error } = await supabase
          .storage
          .from(bucket)
          .createSignedUrl(path, 60);
          
        if (error) {
          throw error;
        }
        
        if (data && data.signedUrl) {
          // Use the signed URL for printing
          PDFStorageService.handlePrint(data.signedUrl);
          return;
        }
      }
      
      // Fallback for direct printing if signed URL fails
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer ce document. Format non supporté ou fichier introuvable.",
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error preparing document for print:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer le document",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteDocument = async () => {
    if (!document.id || !onDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Delete from storage first
      if (document.file_path) {
        const bucket = document.file_path.split('/')[0] === document.file_path 
          ? 'directives_pdfs' 
          : document.file_path.split('/')[0];
          
        const path = document.file_path.includes('/') 
          ? document.file_path.substring(document.file_path.indexOf('/') + 1) 
          : document.file_path;
        
        const { error: storageError } = await supabase
          .storage
          .from(bucket)
          .remove([path]);
          
        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', document.id);
        
      if (dbError) {
        throw dbError;
      }
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
      
      // Notify parent component to refresh the list
      onDelete(document.id);
      
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Determine if this is a card document
  const isCardDocument = document.description && 
    (document.description.toLowerCase().includes('carte') || 
     document.file_path?.includes('cards/'));

  return (
    <>
      <Card key={document.id} className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${isCardDocument ? 'bg-purple-50' : 'bg-blue-50'}`}>
              <FileIcon className={`h-6 w-6 ${isCardDocument ? 'text-purple-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className="font-medium">{document.description || "Directives anticipées"}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {format(new Date(document.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
                </span>
              </div>
              {document.external_id && (
                <Badge variant="outline" className="mt-2">
                  ID: {document.external_id}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handlePreview}
              title="Prévisualiser"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handlePrint}
              title="Imprimer"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleDownload}
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </Button>
            {isAuthenticated && onDelete && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le document sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDocument}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Suppression...
                </>
              ) : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
