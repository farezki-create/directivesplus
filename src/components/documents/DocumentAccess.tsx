
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";
import { useToast } from "@/hooks/use-toast";
import { PDFGenerationService } from "@/utils/PDFGenerationService";
import { ScalingoHDSStorageProvider } from "@/utils/cloud/ScalingoHDSStorageProvider";
import { FileText, Loader2 } from "lucide-react";

interface DocumentAccessProps {
  userId: string;
}

export function DocumentAccess({ userId }: DocumentAccessProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [accessId, setAccessId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleAccessDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !birthDate || !accessId) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Récupérer le provider Scalingo HDS
      const scalingoProvider = new ScalingoHDSStorageProvider();
      
      // Vérifier l'accès au document avec les informations fournies
      const documentId = await scalingoProvider.verifyAccessByCode(accessId, {
        firstName,
        lastName,
        birthDate
      });
      
      if (!documentId) {
        throw new Error("Accès refusé ou document non trouvé");
      }
      
      // Récupérer le document
      const url = await scalingoProvider.retrieveFile(documentId);
      
      if (!url) {
        throw new Error("Impossible de récupérer le document");
      }
      
      setPreviewUrl(url);
      setShowPreview(true);
      
      toast({
        title: "Accès autorisé",
        description: "Le document a été récupéré avec succès"
      });
    } catch (error: any) {
      console.error("Error accessing document:", error);
      toast({
        title: "Erreur d'accès",
        description: error.message || "Impossible d'accéder au document",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Accéder à un document partagé</h2>
      
      <p className="text-gray-600">
        Utilisez ce formulaire pour accéder à un document qui vous a été partagé. 
        Vous devez fournir le code d'accès qui vous a été communiqué, ainsi que les 
        informations d'identité correspondant au document.
      </p>
      
      <Card className="p-6">
        <form onSubmit={handleAccessDocument} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input 
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom du patient"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom du patient"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="JJ/MM/AAAA"
              type="date"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accessId">Code d'accès</Label>
            <Input
              id="accessId"
              value={accessId}
              onChange={(e) => setAccessId(e.target.value)}
              placeholder="Entrez le code d'accès qui vous a été communiqué"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Vérification en cours...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Accéder au document
              </>
            )}
          </Button>
        </form>
      </Card>
      
      {showPreview && previewUrl && (
        <PDFPreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          pdfUrl={previewUrl}
          externalDocumentId={accessId}
        />
      )}
    </div>
  );
}
