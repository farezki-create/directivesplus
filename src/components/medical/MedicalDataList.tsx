
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { MedicalData } from "@/hooks/useMedicalData";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface MedicalDataListProps {
  data: MedicalData[];
}

export function MedicalDataList({ data }: MedicalDataListProps) {
  const navigate = useNavigate();
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy à HH:mm");
  };

  const handleGenerateAccessCard = () => {
    navigate("/generate-pdf?format=card");
    setShowGenerateDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Mes données enregistrées</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setShowGenerateDialog(true)}
        >
          <CreditCard className="h-4 w-4" />
          Générer une carte d'accès
        </Button>
      </div>
      
      {data.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium">Données médicales</span>
                </div>
                <Badge variant="outline" className="ml-2">
                  {item.access_code}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Créé le {formatDate(item.created_at)}
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Dernière modification: {formatDate(item.updated_at)}
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Données médicales</DialogTitle>
                      <DialogDescription>
                        Détails des données médicales enregistrées le {formatDate(item.created_at)}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="max-h-[60vh] overflow-auto">
                      <pre className="p-4 bg-slate-50 rounded-md text-sm overflow-x-auto">
                        {JSON.stringify(item.data, null, 2)}
                      </pre>
                    </div>
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Fermer</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Access Card Generation Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Générer une carte d'accès</DialogTitle>
            <DialogDescription>
              Cette carte permettra aux professionnels de santé d'accéder à vos informations médicales en cas d'urgence.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              La carte d'accès contient un code unique que les professionnels de santé pourront utiliser pour accéder à vos données médicales, avec votre consentement.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleGenerateAccessCard} className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              Générer la carte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {data.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          Aucune donnée médicale enregistrée
        </div>
      )}
    </div>
  );
}
