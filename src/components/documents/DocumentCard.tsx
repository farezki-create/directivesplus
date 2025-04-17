import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, FileIcon, Share2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  file_name: string;
  description?: string;
  created_at: string;
  file_path: string;
  external_id?: string;
}

interface DocumentCardProps {
  document: Document;
  onPreview: (document: Document) => void;
  selectedDocumentId?: string | null;
  sharingCode: string | null;
}

export function DocumentCard({ document, onPreview, selectedDocumentId, sharingCode }: DocumentCardProps) {
  const { toast } = useToast();
  const [localSharingCode, setLocalSharingCode] = useState<string | null>(null);
  
  const generateSharingCode = () => {
    const code = document.external_id || 
                document.file_name.replace('.pdf', '').substring(0, 10) + 
                Math.random().toString(36).substring(2, 8);
    
    setLocalSharingCode(code);
    toast({
      title: "Code de partage généré",
      description: "Partagez ce code avec la personne qui doit accéder au document"
    });
  };

  return (
    <Card key={document.id} className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <FileIcon className="h-6 w-6 text-blue-600" />
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
            onClick={() => onPreview(document)}
            title="Prévisualiser"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={generateSharingCode}
            title="Partager"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {(sharingCode && selectedDocumentId === document.id) || localSharingCode ? (
        <div className="mt-3 p-2 border rounded-md bg-gray-50">
          <p className="text-sm font-medium">Code de partage:</p>
          <div className="flex items-center mt-1">
            <code className="bg-white px-2 py-1 rounded border flex-1 text-sm">
              {sharingCode || localSharingCode}
            </code>
            <Button 
              variant="ghost" 
              size="sm"
              className="ml-2"
              onClick={() => {
                const codeToCopy = sharingCode || localSharingCode;
                if (codeToCopy) {
                  navigator.clipboard.writeText(codeToCopy);
                  toast({
                    title: "Code copié",
                    description: "Le code a été copié dans le presse-papier"
                  });
                }
              }}
            >
              Copier
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Accédez au document sur: directives.sante.fr/access
          </p>
        </div>
      ) : null}
    </Card>
  );
}
