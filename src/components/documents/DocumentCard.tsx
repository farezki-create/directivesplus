
import { FC } from "react";
import { 
  Download, 
  Printer, 
  Send, 
  Eye,
  Trash2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DocumentCardProps {
  document: {
    id: string;
    file_name: string;
    file_path: string;
    created_at: string;
    description?: string;
  };
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string) => void;
  onShare: (documentId: string) => void;
  onView: (filePath: string) => void;
  onDelete: (documentId: string) => void;
}

const DocumentCard: FC<DocumentCardProps> = ({
  document,
  onDownload,
  onPrint,
  onShare,
  onView,
  onDelete
}) => {
  return (
    <Card key={document.id} className="overflow-hidden">
      <CardHeader>
        <CardTitle>{document.file_name}</CardTitle>
        <CardDescription>
          Créé le {new Date(document.created_at).toLocaleDateString('fr-FR')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{document.description || "Directives anticipées"}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            // Vérifier si le chemin du document est valide avant d'appeler onView
            if (document.file_path) {
              // Ouvrir directement le document dans un nouvel onglet si c'est une URL complète
              if (document.file_path.startsWith('http')) {
                window.open(document.file_path, '_blank');
              } else {
                onView(document.file_path);
              }
            }
          }}
        >
          <Eye size={16} />
          Visualiser
        </Button>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onDownload(document.file_path, document.file_name)}
        >
          <Download size={16} />
          Télécharger
        </Button>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onPrint(document.file_path)}
        >
          <Printer size={16} />
          Imprimer
        </Button>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onShare(document.id)}
        >
          <Send size={16} />
          Partager
        </Button>
        <Button 
          variant="outline"
          className="flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(document.id)}
        >
          <Trash2 size={16} />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
