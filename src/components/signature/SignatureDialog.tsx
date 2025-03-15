
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  existingSignature?: string | null;
}

export function SignatureDialog({ open, onOpenChange, userId, existingSignature }: SignatureDialogProps) {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const { toast } = useToast();

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleKeepExisting = async () => {
    if (!existingSignature) return;
    
    try {
      toast({
        title: "Succès",
        description: "Votre signature existante est conservée.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la conservation de la signature:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!signatureRef.current) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la signature.",
        variant: "destructive",
      });
      return;
    }

    if (signatureRef.current.isEmpty()) {
      toast({
        title: "Erreur",
        description: "Veuillez signer avant de sauvegarder.",
        variant: "destructive",
      });
      return;
    }

    try {
      const signatureData = signatureRef.current.toDataURL();
      
      // Utiliser une requête SQL brute pour insérer dans la table user_signatures
      const { error } = await supabase
        .from('user_signatures')
        .upsert({
          user_id: userId,
          signature_data: signatureData,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Signature sauvegardée avec succès.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la signature:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la signature.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Signez votre document</DialogTitle>
        </DialogHeader>
        
        {existingSignature && (
          <div className="border rounded-lg p-4 bg-gray-50 flex flex-col items-center space-y-2 mb-4">
            <p className="text-sm font-medium">Signature existante :</p>
            <img src={existingSignature} alt="Signature existante" className="max-h-[100px]" />
            <Button variant="outline" onClick={handleKeepExisting} className="mt-2 w-full">
              Ne pas modifier ma signature
            </Button>
          </div>
        )}
        
        <div className="border rounded-lg p-4 bg-white">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: "w-full h-[200px] border rounded cursor-crosshair",
              style: { 
                width: '100%', 
                height: '200px',
                backgroundColor: '#fff'
              }
            }}
          />
        </div>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClear}>
            Effacer
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
