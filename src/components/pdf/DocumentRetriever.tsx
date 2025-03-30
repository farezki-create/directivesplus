
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Cloud } from "lucide-react";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";

interface DocumentRetrieverProps {
  userId: string;
  onSyncComplete?: () => void;
}

export function DocumentRetriever({ userId, onSyncComplete }: DocumentRetrieverProps) {
  const [documentId, setDocumentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { retrieveExternalDocument, syncToExternalStorage } = usePDFGeneration(userId);

  const handleRetrieve = async () => {
    if (!documentId.trim()) return;
    
    setIsLoading(true);
    try {
      await retrieveExternalDocument(documentId.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    try {
      await syncToExternalStorage();
      if (onSyncComplete) {
        onSyncComplete();
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Récupérer un document</h3>
      <div className="flex space-x-2">
        <Input
          placeholder="Entrez l'identifiant du document"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleRetrieve} 
          disabled={isLoading || !documentId.trim()}
        >
          {isLoading ? (
            <div className="h-4 w-4 border-b-2 border-white rounded-full animate-spin mr-2"></div>
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Rechercher
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2 mb-4">
        Utilisez l'identifiant qui vous a été fourni lors de la génération de votre document.
      </p>
      
      <div className="mt-4 pt-4 border-t border-border">
        <Button 
          onClick={handleSyncToCloud}
          disabled={isSyncing}
          variant="outline"
          className="w-full"
        >
          {isSyncing ? (
            <div className="h-4 w-4 border-b-2 border-primary rounded-full animate-spin mr-2"></div>
          ) : (
            <Cloud className="h-4 w-4 mr-2" />
          )}
          Synchroniser avec le stockage cloud
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Cette action sauvegardera vos documents dans une base de données cloud sécurisée pour un accès à long terme.
        </p>
      </div>
    </Card>
  );
}
