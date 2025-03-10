
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SignatureCanvas from 'react-signature-canvas';
import { Check, X, FileSignature } from "lucide-react";

interface SignatureComponentProps {
  userId: string;
  existingSignature: string | null;
  onSignatureSaved: (signature: string) => void;
}

export function SignatureComponent({ userId, existingSignature, onSignatureSaved }: SignatureComponentProps) {
  const [showSignature, setShowSignature] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleSaveSignature = async () => {
    try {
      setLoading(true);
      
      if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
        toast({
          title: "Erreur",
          description: "Veuillez signer avant de confirmer.",
          variant: "destructive",
        });
        return;
      }
      
      const signatureData = sigCanvas.current.toDataURL('image/png');
      
      // First save to questionnaire_synthesis
      const { data, error: fetchError } = await supabase
        .from("questionnaire_synthesis")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking for existing synthesis:", fetchError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification des données existantes.",
          variant: "destructive",
        });
        return;
      }

      let synthError;
      if (data) {
        const { error } = await supabase
          .from("questionnaire_synthesis")
          .update({ signature: signatureData })
          .eq("id", data.id);
        synthError = error;
      } else {
        const { error } = await supabase
          .from("questionnaire_synthesis")
          .insert({
            user_id: userId,
            signature: signatureData
          });
        synthError = error;
      }

      if (synthError) {
        throw synthError;
      }
      
      // Then save to user_signatures for reuse across PDFs
      const { data: sigData } = await supabase
        .from('user_signatures')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();
        
      let sigError;
      if (sigData) {
        const { error } = await supabase
          .from('user_signatures')
          .update({ signature_data: signatureData })
          .eq('user_id', userId);
        sigError = error;
      } else {
        const { error } = await supabase
          .from('user_signatures')
          .insert({
            user_id: userId,
            signature_data: signatureData
          });
        sigError = error;
      }
      
      if (sigError) {
        throw sigError;
      }
      
      setShowSignature(false);
      toast({
        title: "Succès",
        description: "Votre signature a été enregistrée.",
      });
      
      onSignatureSaved(signatureData);
    } catch (error) {
      console.error("Error saving signature:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre signature. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Signer le document</h3>
      <p className="text-sm text-gray-500">
        Merci d'avoir enregistré vos directives. Veuillez maintenant signer pour valider ce document.
      </p>
      
      {!showSignature && !existingSignature && (
        <Button
          onClick={() => setShowSignature(true)}
          className="w-full"
        >
          <FileSignature className="mr-2 h-4 w-4" />
          Ajouter ma signature
        </Button>
      )}

      {existingSignature && !showSignature && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Signature existante:</p>
          <Card className="p-4 flex justify-center">
            <img src={existingSignature} alt="Signature" className="max-h-[150px]" />
          </Card>
          <Button
            onClick={() => setShowSignature(true)}
            variant="outline"
            className="w-full"
          >
            <FileSignature className="mr-2 h-4 w-4" />
            Modifier ma signature
          </Button>
        </div>
      )}
      
      {showSignature && (
        <div className="space-y-4">
          <p className="text-sm font-medium">Veuillez signer ci-dessous:</p>
          <Card className="p-2 border-2 border-gray-300">
            <SignatureCanvas 
              ref={sigCanvas}
              canvasProps={{
                className: 'w-full h-[250px]'
              }}
            />
          </Card>
          <div className="flex gap-2">
            <Button 
              onClick={clearSignature} 
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Effacer
            </Button>
            <Button 
              onClick={handleSaveSignature} 
              className="flex-1"
              disabled={loading}
            >
              <Check className="mr-2 h-4 w-4" />
              Confirmer ma signature
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
