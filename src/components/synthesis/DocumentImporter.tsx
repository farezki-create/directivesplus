
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
      console.log("Fichier sélectionné:", file.name, file.type, file.size);
      setSelectedFile(file);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    console.log("Début extraction pour:", file.name, "Type:", file.type);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        console.log("Lecture du fichier terminée");
        const content = e.target?.result as string;
        
        if (file.type === 'text/plain') {
          console.log("Fichier texte détecté, contenu:", content.substring(0, 100) + "...");
          resolve(content);
        } else if (file.type === 'application/pdf') {
          // Pour les PDF, on informe l'utilisateur qu'il doit copier/coller le contenu
          const pdfMessage = `Contenu du fichier PDF "${file.name}" détecté.\n\nPour les fichiers PDF, veuillez copier et coller manuellement le texte depuis votre document dans cette zone.\n\nVous pouvez également convertir votre PDF en fichier texte (.txt) pour une importation automatique.`;
          console.log("PDF détecté, message informatif généré");
          resolve(pdfMessage);
        } else if (file.name.toLowerCase().endsWith('.txt')) {
          // Forcer la lecture en tant que texte même si le type MIME n'est pas détecté
          console.log("Extension .txt détectée, traitement comme texte");
          resolve(content);
        } else {
          // Pour les autres types, essayer d'extraire le texte
          try {
            console.log("Tentative d'extraction de texte pour type:", file.type);
            resolve(content);
          } catch (error) {
            console.error("Erreur lors de l'extraction:", error);
            reject(new Error("Format de fichier non supporté pour l'extraction automatique"));
          }
        }
      };
      
      reader.onerror = (error) => {
        console.error("Erreur de lecture:", error);
        reject(new Error("Erreur lors de la lecture du fichier"));
      };
      
      // Lire le fichier selon son type
      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        console.log("Lecture en mode texte");
        reader.readAsText(file, 'UTF-8');
      } else {
        console.log("Lecture en mode texte (fallback)");
        reader.readAsText(file, 'UTF-8');
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

    console.log("=== DÉBUT IMPORTATION ===");
    console.log("Fichier à importer:", selectedFile.name, selectedFile.type, selectedFile.size);

    try {
      setImporting(true);
      
      const extractedContent = await extractTextFromFile(selectedFile);
      
      console.log("Contenu extrait:", extractedContent.substring(0, 200) + "...");
      
      if (extractedContent && extractedContent.trim()) {
        onContentExtracted(extractedContent);
        
        toast({
          title: "Contenu importé",
          description: `Le contenu du fichier "${selectedFile.name}" a été ajouté aux précisions complémentaires`
        });
        
        console.log("Import réussi, nettoyage...");
        
        // Réinitialiser
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        console.error("Contenu extrait vide");
        toast({
          title: "Erreur",
          description: "Le fichier semble être vide ou le contenu n'a pas pu être extrait",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de l'extraction du contenu:", error);
      toast({
        title: "Erreur d'importation",
        description: error.message || "Erreur lors de l'importation du document",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
      console.log("=== FIN IMPORTATION ===");
    }
  };

  const clearSelection = () => {
    console.log("Nettoyage de la sélection");
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
          
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Formats supportés :</strong></p>
            <p>• <strong>TXT</strong> : Importation automatique du contenu</p>
            <p>• <strong>PDF</strong> : Instructions pour copie manuelle</p>
            <p>• <strong>DOC/DOCX</strong> : Extraction basique (résultats variables)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentImporter;
