
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScalingoHDSStorageProvider } from "@/utils/cloud/ScalingoHDSStorageProvider";
import { useToast } from "@/hooks/use-toast";
import { Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

  const handleOpen = (file: ScalingoFile) => {
    if (file.url) {
      window.open(file.url, "_blank");
    } else {
      toast({
        title: "Erreur",
        description: "L'URL du document est introuvable.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (file: ScalingoFile) => {
    try {
      const confirmed = window.confirm("Voulez-vous vraiment supprimer ce document ?");
      if (!confirmed) return;
      
      setDeleting(file.id);
      console.log("Deleting file with ID:", file.id);
      
      const ok = await scalingoProvider.deleteFile(file.id);
      
      if (ok) {
        toast({
          title: "Document supprimé",
          description: `Le document ${file.file_name} a été supprimé avec succès.`,
        });
        // Mettre à jour la liste de fichiers localement sans refetch
        setFiles(files.filter(f => f.id !== file.id));
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le document.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="h-6 w-6 border-b-2 border-primary rounded-full animate-spin"></div>
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
      {files.map(file => (
        <Card key={file.id} className="p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">{file.file_name}</div>
            <div className="text-sm text-gray-500">{format(new Date(file.created_at), "dd MMMM yyyy", { locale: fr })}</div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" title="Ouvrir" onClick={() => handleOpen(file)}>
              <Eye className="h-5 w-5" />
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
    </div>
  );
}
