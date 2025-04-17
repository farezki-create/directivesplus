
import { useState } from "react";
import { DocumentScanner } from "@/components/DocumentScanner";
import { DocumentActions } from "./DocumentActions";
import { DocumentCard } from "./DocumentCard";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { IdCard } from "lucide-react";

export function DocumentList({ userId }: { userId: string }) {
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleAddMedicalDocument = () => {
    setShowDocumentScanner(true);
  };

  const generateAccessCard = () => {
    // Generate a unique code (in a real app, this would be stored in the database)
    const uniqueCode = `MED-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setAccessCode(uniqueCode);
    
    toast({
      title: "Carte d'accès générée",
      description: "Une nouvelle carte d'accès a été créée pour vos documents."
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Vos documents médicaux</h2>
      
      <DocumentActions 
        onAddMedicalDocument={handleAddMedicalDocument}
      />

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-3">Accès à vos documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Générez une carte d'accès que vous pouvez partager avec une personne ou une institution médicale.
        </p>
        
        <Button 
          onClick={generateAccessCard} 
          variant="outline" 
          className="flex items-center gap-2 mb-4"
        >
          <IdCard className="h-4 w-4" /> 
          Générer une carte d'accès
        </Button>
        
        {accessCode && (
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-blue-800 mb-1">CARTE ACCÈS DOCUMENTS MÉDICAUX</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">Code d'accès:</span> {accessCode}</p>
                  <p><span className="font-semibold">Date d'émission:</span> {format(new Date(), "dd MMMM yyyy", { locale: fr })}</p>
                  <p><span className="font-semibold">Lien d'accès:</span> directives-anticipees.lovable.dev/access</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <IdCard className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-xs text-gray-600">
                Cette carte permet l'accès sécurisé aux documents médicaux. Pour y accéder, 
                veuillez utiliser le code d'accès et le lien fournis ci-dessus.
              </p>
            </div>
          </Card>
        )}
      </div>

      <DocumentScanner 
        open={showDocumentScanner} 
        onClose={() => setShowDocumentScanner(false)}
      />
    </div>
  );
}

function navigate(path: string) {
  window.location.href = path;
}
