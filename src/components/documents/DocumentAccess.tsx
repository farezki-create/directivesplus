
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2 } from "lucide-react";
import { useDocumentAccess } from "@/hooks/useDocumentAccess";
import { DocumentsList } from "./DocumentsList";
import { supabase } from "@/integrations/supabase/client";

interface DocumentAccessProps {
  userId: string;
}

export function DocumentAccess({ userId }: DocumentAccessProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [accessId, setAccessId] = useState("");
  const { toast } = useToast();

  const { isVerifying, verifyAccess } = useDocumentAccess();
  const [accessData, setAccessData] = useState<{
    isFullAccess: boolean;
    allowedDocumentId?: string;
  } | null>(null);
  const [documents, setDocuments] = useState([]);

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
    
    try {
      const accessResult = await verifyAccess(accessId, firstName, lastName, birthDate);
      
      if (!accessResult) {
        throw new Error("Accès refusé ou document non trouvé");
      }

      setAccessData({
        isFullAccess: accessResult.is_full_access,
        allowedDocumentId: accessResult.document_id
      });

      // Fetch available documents
      const { data: docs, error: docsError } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('user_id', userId);

      if (docsError) throw docsError;
      setDocuments(docs);
      
      toast({
        title: "Accès autorisé",
        description: accessResult.is_full_access 
          ? "Vous avez accès à tous les documents" 
          : "Vous avez accès au document spécifié"
      });
    } catch (error: any) {
      console.error("Error accessing documents:", error);
      toast({
        title: "Erreur d'accès",
        description: error.message || "Impossible d'accéder aux documents",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Accéder à un document partagé</h2>
      
      <p className="text-gray-600">
        Utilisez ce formulaire pour accéder aux documents qui vous ont été partagés. 
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
                Accéder aux documents
              </>
            )}
          </Button>
        </form>
      </Card>
      
      {accessData && documents.length > 0 && (
        <Card className="p-6">
          <DocumentsList
            documents={documents}
            onPreview={() => {}}
            selectedDocumentId={null}
            sharingCode={null}
            previewUrl={null}
            isPreviewOpen={false}
            setIsPreviewOpen={() => {}}
            restrictedAccess={accessData}
          />
        </Card>
      )}
    </div>
  );
}
