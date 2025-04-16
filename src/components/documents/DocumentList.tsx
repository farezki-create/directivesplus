
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FileIcon, 
  Download, 
  Eye, 
  Share2, 
  Calendar, 
  Loader2,
  FileText,
  CreditCard,
  UploadCloud,
  ScanLine
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { DocumentScanner } from "@/components/DocumentScanner";

interface Document {
  id: string;
  file_name: string;
  description?: string;
  created_at: string;
  file_path: string;
  external_id?: string;
}

export function DocumentList({ userId }: { userId: string }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sharingCode, setSharingCode] = useState<string | null>(null);
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const { retrieveExternalDocument } = usePDFGeneration(userId);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('pdf_documents')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setDocuments(data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer vos documents",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchDocuments();
    }
  }, [userId, toast]);

  const handlePreview = async (document: Document) => {
    setSelectedDocument(document);
    
    try {
      const documentId = document.external_id || document.file_name.replace('.pdf', '');
      const url = await retrieveExternalDocument(documentId);
      
      if (url) {
        setPreviewUrl(url);
        setShowPreview(true);
      } else {
        throw new Error("Impossible de récupérer le document");
      }
    } catch (error) {
      console.error("Error retrieving document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de prévisualiser ce document",
        variant: "destructive"
      });
    }
  };

  const generateSharingCode = (document: Document) => {
    // Pour une démonstration, nous prenons l'external_id existant ou générons un code simple
    // Dans une implémentation réelle, on génèrerait un code unique et on le stockerait en base
    const code = document.external_id || 
                 document.file_name.replace('.pdf', '').substring(0, 10) + 
                 Math.random().toString(36).substring(2, 8);
    
    setSharingCode(code);
    toast({
      title: "Code de partage généré",
      description: "Partagez ce code avec la personne qui doit accéder au document"
    });
  };

  // Trouve le document le plus récent des directives anticipées
  const findLatestDirective = () => {
    const directives = documents.filter(doc => 
      doc.description?.toLowerCase().includes('directive') || 
      doc.file_name.toLowerCase().includes('directive')
    );
    return directives.length > 0 ? directives[0] : null;
  };

  const handleAddMedicalDocument = () => {
    setShowDocumentScanner(true);
  };

  const handleViewDirectives = async () => {
    const latestDirective = findLatestDirective();
    
    if (latestDirective) {
      handlePreview(latestDirective);
    } else {
      toast({
        title: "Information",
        description: "Aucune directive anticipée trouvée. Veuillez générer vos directives d'abord.",
      });
      setTimeout(() => {
        navigate('/generate-pdf');
      }, 2000);
    }
  };

  const handleViewCardFormat = async () => {
    // Rediriger vers la page de génération de carte format bancaire
    navigate('/generate-pdf');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Vos directives anticipées</h2>
      
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Button
          onClick={handleViewDirectives}
          className="flex items-center gap-2 h-auto py-3"
        >
          <FileText className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Mes directives anticipées</div>
            <div className="text-xs text-muted-foreground">Afficher mon document complet</div>
          </div>
        </Button>
        
        <Button
          onClick={handleAddMedicalDocument}
          variant="outline"
          className="flex items-center gap-2 h-auto py-3"
        >
          <UploadCloud className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Ajouter un document médical</div>
            <div className="text-xs text-muted-foreground">Télécharger ou scanner un document</div>
          </div>
        </Button>
      </div>
      
      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Vous n'avez pas encore généré de documents.</p>
          <Button 
            onClick={() => navigate('/generate-pdf')} 
            className="mt-4"
          >
            Générer mes directives
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Mes documents</h3>
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FileIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{doc.description || "Directives anticipées"}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(doc.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
                      </span>
                    </div>
                    {doc.external_id && (
                      <Badge variant="outline" className="mt-2">
                        ID: {doc.external_id}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handlePreview(doc)}
                    title="Prévisualiser"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => generateSharingCode(doc)}
                    title="Partager"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {sharingCode && selectedDocument?.id === doc.id && (
                <div className="mt-3 p-2 border rounded-md bg-gray-50">
                  <p className="text-sm font-medium">Code de partage:</p>
                  <div className="flex items-center mt-1">
                    <code className="bg-white px-2 py-1 rounded border flex-1 text-sm">
                      {sharingCode}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(sharingCode);
                        toast({
                          title: "Code copié",
                          description: "Le code a été copié dans le presse-papier"
                        });
                      }}
                    >
                      Copier
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      
      {showPreview && previewUrl && (
        <PDFPreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          pdfUrl={previewUrl}
          externalDocumentId={selectedDocument?.external_id || ""}
        />
      )}

      <DocumentScanner 
        open={showDocumentScanner} 
        onClose={() => setShowDocumentScanner(false)}
      />
    </div>
  );
}

// Helper function for navigation
function navigate(path: string) {
  window.location.href = path;
}
