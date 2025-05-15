
import { FC } from "react";
import { 
  Download, 
  Printer, 
  Send, 
  Eye,
  Trash2,
  FileText,
  Music
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
    content_type?: string;
  };
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onShare: (documentId: string) => void;
  onView: (filePath: string, contentType?: string) => void;
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
  const isAudio = document.content_type?.includes('audio');

  return (
    <Card key={document.id} className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start gap-2">
          {isAudio ? (
            <Music size={18} className="mt-1 text-blue-500" />
          ) : (
            <FileText size={18} className="mt-1 text-gray-500" />
          )}
          <div className="flex-1">
            <CardTitle>{document.file_name}</CardTitle>
            <CardDescription>
              Créé le {new Date(document.created_at).toLocaleDateString('fr-FR')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{document.description || "Directives anticipées"}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onDownload(document.file_path, document.file_name)}
        >
          <Eye size={16} />
          {isAudio ? "Écouter" : "Visualiser"}
        </Button>
        
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onDownload(document.file_path, document.file_name)}
        >
          <Download size={16} />
          Télécharger
        </Button>
        
        {!isAudio && (
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onPrint(document.file_path, document.content_type)}
          >
            <Printer size={16} />
            Imprimer
          </Button>
        )}
        
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
