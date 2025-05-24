
import { Button } from "@/components/ui/button";
import { Hospital, Check, Copy, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InstitutionCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  institutionCode: string | null;
  copied: boolean;
  onCopyCode: () => void;
}

const InstitutionCodeDialog = ({
  isOpen,
  onClose,
  institutionCode,
  copied,
  onCopyCode
}: InstitutionCodeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hospital className="h-5 w-5" />
            Code d'accès professionnel généré
          </DialogTitle>
          <DialogDescription>
            Partagez ce code avec votre professionnel de santé ou institution médicale.
            Il sera valide pendant 30 jours.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Code généré avec succès !</strong><br />
              Ce code permet l'accès sécurisé à vos directives avec vos informations d'identité.
            </AlertDescription>
          </Alert>
          
          {institutionCode && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <span className="font-mono text-2xl tracking-[0.3em] font-bold text-green-800">
                  {institutionCode}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onCopyCode}
                  className="text-green-600 hover:text-green-700 hover:bg-green-100"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important :</strong> Ce code permet l'accès à vos directives anticipées. 
                  Ne le partagez qu'avec des professionnels de santé de confiance.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstitutionCodeDialog;
