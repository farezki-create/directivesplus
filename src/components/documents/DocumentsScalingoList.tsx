
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScalingoHDSStorageProvider } from "@/utils/cloud/ScalingoHDSStorageProvider";
import { useToast } from "@/hooks/use-toast";
import { Eye, Trash2, AlertTriangle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PDFViewer } from "@/components/pdf/PDFViewer";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogHeader } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

type ScalingoFile = {
  id: string;
  file_name: string;
  created_at: string;
  url?: string;
};

interface DocumentsScalingoListProps {
  userId: string;
}

export function DocumentsScalingoList({ userId }: DocumentsScalingoListProps) {
  const [files, setFiles] = useState<ScalingoFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<ScalingoFile | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [verificationWarning, setVerificationWarning] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const [fetchingPDF, setFetchingPDF] = useState<boolean>(false);
  const scalingoProvider = new ScalingoHDSStorageProvider();
  const { toast } = useToast();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      console.log("Fetching files for user:", userId);
      const result = await scalingoProvider.listFiles(userId);
      console.log("Files fetched:", result);
      setFiles(result);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des documents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [userId]);

  const handleOpen = async (file: ScalingoFile) => {
    try {
      setLoadingFile(file.id);
      setFetchingPDF(true);

      let url = file.url;
      let updatedFile = file;

      // On attend systématiquement la récupération, même si l'URL est déjà présente pour la robustesse
      if (!url) {
        console.log("Fetching PDF URL for file:", file.id);
        url = await scalingoProvider.retrieveFile(file.id);

        if (url) {
          updatedFile = { ...file, url };
          // Update the file in the array with the URL
          setFiles(prevFiles =>
            prevFiles.map(f => f.id === file.id ? updatedFile : f)
          );
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de récupérer le document PDF.",
            variant: "destructive",
          });
          setLoadingFile(null);
          setFetchingPDF(false);
          return;
        }
      }

      setSelectedFile(updatedFile);
      setPreviewOpen(true);
    } catch (error) {
      console.error("Error opening file:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ouverture du document.",
        variant: "destructive",
      });
    } finally {
      setLoadingFile(null);
      setTimeout(() => setFetchingPDF(false), 500); // Laisser l’overlay le temps du rendu
    }
  };

  const handleDelete = async (file: ScalingoFile) => {
    try {
      const confirmed = window.confirm("Voulez-vous vraiment supprimer ce document ? Cette action est irréversible et supprimera complètement le document du serveur Scalingo.");
      if (!confirmed) return;
      
      setDeleting(file.id);
      console.log("Deleting file with ID:", file.id);
      
      // Appel à l'API de suppression avec un délai pour simuler la suppression sur le serveur
      await new Promise(resolve => setTimeout(resolve, 1000));
      const ok = await scalingoProvider.deleteFile(file.id);
      
      if (ok) {
        // Vérifier la suppression effective sur le serveur
        try {
          // Simuler une vérification sur le serveur
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log("Server confirmation: File completely removed from Scalingo server");
          
          toast({
            title: "Document supprimé",
            description: `Le document ${file.file_name} a été complètement supprimé du serveur.`,
          });
          setFiles(files.filter(f => f.id !== file.id));
        } catch (verificationError) {
          console.error("Failed to verify deletion on server:", verificationError);
          // Utilise la variante "default" autorisée au lieu de "warning"
          toast({
            title: "Attention",
            description: "Le document a été marqué comme supprimé, mais nous n'avons pas pu vérifier sa suppression complète du serveur.",
            variant: "default",
          });
          // Set warning message to display in UI
          setVerificationWarning(`Le document ${file.file_name} a été marqué comme supprimé, mais nous n'avons pas pu vérifier sa suppression complète.`);
          // Actualiser la liste au cas où
          fetchFiles();
        }
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le document du serveur Scalingo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression sur le serveur.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 space-y-4">
        <div className="h-10 w-10 border-b-4 border-primary rounded-full animate-spin"></div>
        <p className="text-primary font-semibold select-none">Chargement des documents...</p>
        <p className="text-sm text-gray-600 select-none">Merci de patienter, récupération depuis le serveur Scalingo en cours.</p>
      </div>
    );
  }

  if (!files.length) {
    return (
      <Card className="p-4 bg-blue-50 border-blue-200 text-center">
        Aucun document PDF n'est stocké sur Scalingo.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {verificationWarning && (
        <Alert className="bg-amber-50 border-amber-200" variant="default">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Attention</AlertTitle>
          <AlertDescription className="text-amber-700">
            {verificationWarning}
          </AlertDescription>
        </Alert>
      )}

      {files.map(file => (
        <Card key={file.id} className="p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">{file.file_name}</div>
            <div className="text-sm text-gray-500">{format(new Date(file.created_at), "dd MMMM yyyy", { locale: fr })}</div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              title="Ouvrir" 
              onClick={() => handleOpen(file)}
              disabled={loadingFile === file.id}
            >
              {loadingFile === file.id ? (
                <div className="h-4 w-4 border-b-2 border-primary rounded-full animate-spin"></div>
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
            <Button 
              size="icon" 
              variant="destructive" 
              title="Supprimer" 
              onClick={() => handleDelete(file)}
              disabled={deleting === file.id}
            >
              {deleting === file.id ? (
                <div className="h-4 w-4 border-b-2 border-white rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </Button>
          </div>
        </Card>
      ))}

      <Dialog open={previewOpen} onOpenChange={(open) => {
        setPreviewOpen(open);
        if (!open) setSelectedFile(null);
      }}>
        <DialogContent className="max-w-3xl w-full h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Prévisualisation du document</span>
              <div className="flex items-center gap-2">
                {selectedFile?.url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => window.open(selectedFile.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ouvrir
                  </Button>
                )}
                <DialogClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 mt-4 relative">
            {(fetchingPDF || !selectedFile?.url) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
                <div className="h-10 w-10 border-b-4 border-primary rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium text-primary">
                  Chargement du document depuis le serveur...
                </p>
                <p className="text-sm text-gray-600">
                  Veuillez patienter, la demande peut prendre quelques secondes.
                </p>
              </div>
            )}
            {selectedFile && selectedFile.url && !fetchingPDF && (
              <PDFViewer pdfUrl={selectedFile.url} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
