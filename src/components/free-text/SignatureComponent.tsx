
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SignatureCanvasLib from 'react-signature-canvas';
import { FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignatureCanvas } from "./SignatureCanvas";
import { SignatureDisplay } from "./SignatureDisplay";
import { SignatureActions } from "./SignatureActions";

interface SignatureComponentProps {
  userId: string;
  existingSignature: string | null;
  onSignatureSaved: (signature: string) => void;
}

export function SignatureComponent({ userId, existingSignature, onSignatureSaved }: SignatureComponentProps) {
  const [showSignature, setShowSignature] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const sigCanvas = useRef<SignatureCanvasLib>(null);

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

  const showSignatureEditor = () => {
    setShowSignature(true);
  };

  const handleConfirmSignature = () => {
    if (existingSignature) {
      onSignatureSaved(existingSignature);
      
      toast({
        title: "Succès",
        description: "Votre signature a été confirmée.",
      });
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
          onClick={showSignatureEditor}
          className="w-full"
        >
          <FileSignature className="mr-2 h-4 w-4" />
          Ajouter ma signature
        </Button>
      )}

      {existingSignature && !showSignature && (
        <SignatureDisplay 
          signatureData={existingSignature}
          onEdit={showSignatureEditor}
          onConfirm={handleConfirmSignature}
        />
      )}
      
      {showSignature && (
        <div className="space-y-4">
          <SignatureCanvas 
            signatureRef={sigCanvas}
            disabled={loading}
          />
          <SignatureActions 
            onSaveSignature={handleSaveSignature}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
