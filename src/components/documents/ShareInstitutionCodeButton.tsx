
import { Button } from "@/components/ui/button";
import { Hospital } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ShareInstitutionCodeButtonProps {
  directiveId?: string;
  userId?: string;
}

const ShareInstitutionCodeButton = ({ directiveId, userId }: ShareInstitutionCodeButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Hospital className="h-4 w-4" />
          Accès professionnel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hospital className="h-5 w-5" />
            Code d'accès professionnel
          </DialogTitle>
          <DialogDescription>
            Fonctionnalité temporairement désactivée
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Le système de partage a été temporairement désactivé pour simplification.
              Une nouvelle version plus simple sera bientôt disponible.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareInstitutionCodeButton;
