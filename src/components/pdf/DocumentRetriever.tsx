
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, CloudUpload, Settings, CloudCog } from "lucide-react";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { StorageProviderSelector } from "./StorageProviderSelector";
import { Badge } from "@/components/ui/badge";

interface DocumentRetrieverProps {
  userId: string;
  onSyncComplete?: () => void;
}

export function DocumentRetriever({ userId, onSyncComplete }: DocumentRetrieverProps) {
  const [documentId, setDocumentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showCloudConfig, setShowCloudConfig] = useState(false);
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Récupérer un document</h3>
        <Badge variant="outline" className="bg-blue-50">
          Stockage Cloud
        </Badge>
      </div>
      
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
          className="w-full mb-2"
        >
          {isSyncing ? (
            <div className="h-4 w-4 border-b-2 border-primary rounded-full animate-spin mr-2"></div>
          ) : (
            <CloudUpload className="h-4 w-4 mr-2" />
          )}
          Synchroniser avec le stockage cloud
        </Button>
        
        <Button
          variant="ghost"
          className="w-full flex justify-center items-center"
          onClick={() => setShowCloudConfig(!showCloudConfig)}
        >
          <CloudCog className="h-4 w-4 mr-2" />
          {showCloudConfig ? "Masquer les options d'hébergement" : "Options d'hébergement (incl. HDS)"}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2">
          Cette action sauvegardera vos documents dans une base de données cloud sécurisée pour un accès à long terme.
          {!showCloudConfig && (
            <span className="block mt-1 font-medium text-blue-600">
              Des options d'hébergement HDS sont disponibles.
            </span>
          )}
        </p>
      </div>
      
      {showCloudConfig && (
        <div className="mt-4 pt-4 border-t border-border">
          <StorageProviderSelector />
        </div>
      )}
    </Card>
  );
}
