
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PDFPreviewDialog } from "@/components/pdf/PDFPreviewDialog";
import { useToast } from "@/hooks/use-toast";
import { ScalingoHDSStorageProvider } from "@/utils/cloud/ScalingoHDSStorageProvider";
import { Loader2, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";

export default function ExternalAccess() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [accessId, setAccessId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize Scalingo HDS Storage Provider
  const scalingoProvider = new ScalingoHDSStorageProvider();

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
      console.log("[ExternalAccess] Verifying access to document via Scalingo HDS");
      
      // Verify access to the document
      const documentId = await scalingoProvider.verifyAccessByCode(accessId, {
        firstName,
        lastName,
        birthDate
      });
      
      if (!documentId) {
        throw new Error("Accès refusé ou document non trouvé");
      }
      
      console.log("[ExternalAccess] Access verified, retrieving document from Scalingo HDS");
      
      // Retrieve the document
      const url = await scalingoProvider.retrieveFile(documentId);
      
      if (!url) {
        throw new Error("Impossible de récupérer le document");
      }
      
      setPreviewUrl(url);
      // Don't automatically show the preview
      // setShowPreview(true);
      
      toast({
        title: "Accès autorisé",
        description: "Le document a été récupéré depuis Scalingo HDS avec succès"
      });

      // Instead of showing the preview directly, redirect to a dedicated document viewer page
      // with the URL as state
      navigate("/my-documents", { 
        state: { 
          accessData: {
            documentUrl: url,
            externalDocumentId: accessId
          }
        }
      });

    } catch (error: any) {
      console.error("[ExternalAccess] Error accessing document:", error);
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto py-8 px-4 flex-1">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Accès aux documents partagés</h2>
            <p className="mt-2 text-gray-600">
              Veuillez compléter le formulaire pour accéder aux documents qui ont été partagés avec vous.
            </p>
          </div>
          
          <Card className="p-6">
            <form onSubmit={handleAccessDocument} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom du patient</Label>
                <Input 
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom du patient</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom"
                  required
                />
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
                  placeholder="Code d'accès"
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
        </div>
      </main>
      
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
