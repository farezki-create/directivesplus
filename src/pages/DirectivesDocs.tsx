
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { 
  Download, 
  Printer, 
  Send, 
  FileText, 
  Eye,
  Trash2
} from "lucide-react";
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

const DirectivesDocs = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/mes-directives" } });
    } else if (isAuthenticated && user) {
      fetchDocuments();
    }
  }, [isAuthenticated, isLoading, user]);

  const fetchDocuments = async () => {
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
  };

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement réussi",
        description: "Votre document a été téléchargé"
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const handlePrint = (filePath: string) => {
    try {
      // Créer un iframe temporaire pour l'impression
      const printFrame = document.createElement('iframe');
      printFrame.style.display = 'none';
      document.body.appendChild(printFrame);
      
      printFrame.onload = () => {
        try {
          // Déclencher l'impression une fois l'iframe chargé
          setTimeout(() => {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
            
            // Supprimer l'iframe après l'impression
            setTimeout(() => {
              document.body.removeChild(printFrame);
            }, 1000);
          }, 500);
        } catch (err) {
          console.error("Erreur lors de l'impression:", err);
          document.body.removeChild(printFrame);
          toast({
            title: "Erreur",
            description: "Impossible d'imprimer le document",
            variant: "destructive"
          });
        }
      };
      
      // Charger le PDF dans l'iframe
      printFrame.src = filePath;
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
  
  const handleView = (filePath: string) => {
    try {
      window.open(filePath, '_blank');
    } catch (error) {
      console.error("Erreur lors de l'ouverture du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document",
        variant: "destructive"
      });
    }
  };
  
  const confirmDelete = (documentId: string) => {
    setDocumentToDelete(documentId);
  };
  
  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      const { error } = await supabase
        .from('pdf_documents')
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
          <h1 className="text-3xl font-bold text-center mb-8">Mes Directives</h1>
          
          {documents.length === 0 ? (
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Aucun document</h3>
                <p className="text-gray-500">
                  Vous n'avez pas encore généré de directives anticipées.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => navigate("/synthese")}>
                  Créer mes directives
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{doc.file_name}</CardTitle>
                    <CardDescription>
                      Créé le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{doc.description || "Directives anticipées"}</p>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleView(doc.file_path)}
                    >
                      <Eye size={16} />
                      Visualiser
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleDownload(doc.file_path, doc.file_name)}
                    >
                      <Download size={16} />
                      Télécharger
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handlePrint(doc.file_path)}
                    >
                      <Printer size={16} />
                      Imprimer
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleShare(doc.id)}
                    >
                      <Send size={16} />
                      Partager
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => confirmDelete(doc.id)}
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </Button>
                  </CardFooter>
                </Card>
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
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default DirectivesDocs;
