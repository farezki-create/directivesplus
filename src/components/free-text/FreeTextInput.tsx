
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FreeTextSection } from "./FreeTextSection";
import { SaveButton } from "./SaveButton";
import { SignButton } from "./SignButton";
import { SignatureComponent } from "./SignatureComponent";
import { useSynthesis } from "@/hooks/useSynthesis";

interface FreeTextInputProps {
  userId: string;
  onSaveComplete?: () => void;
  onSignComplete?: () => void;
}

export function FreeTextInput({ userId, onSaveComplete, onSignComplete }: FreeTextInputProps) {
  const { text, setText, saveSynthesis, isSaving } = useSynthesis(userId);
  const [initialText, setInitialText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignatureSection, setShowSignatureSection] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSignature = async () => {
      if (!userId) return;
      
      try {
        console.log("[FreeTextInput] Fetching signature for user:", userId);
        
        const { data, error } = await supabase
          .from("questionnaire_synthesis")
          .select("signature")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) {
          console.error("[FreeTextInput] Error fetching signature:", error);
          return;
        }

        if (data?.signature) {
          console.log("[FreeTextInput] Found existing signature");
          setSignature(data.signature);
          setIsSaved(true);
        } else {
          console.log("[FreeTextInput] No existing signature found");
        }
      } catch (error) {
        console.error("[FreeTextInput] Unexpected error:", error);
      }
    };

    fetchSignature();
    setInitialText(text);
  }, [userId, text]);

  const handleTextChange = (newText: string) => {
    console.log("[FreeTextInput] Text changed, new length:", newText.length);
    setText(newText);
  };

  const handleSaveComplete = async () => {
    const success = await saveSynthesis();
    if (success) {
      setInitialText(text);
      setIsSaved(true);
      if (onSaveComplete) {
        onSaveComplete();
      }
    }
  };

  const handleSignatureSaved = (signatureData: string) => {
    setSignature(signatureData);
    if (onSignComplete) {
      onSignComplete();
    }
  };

  // Determine if there are changes that need to be saved
  const hasChanges = text !== initialText;
  
  console.log("[FreeTextInput] Button state:", {
    isSaving,
    hasChanges,
    freeTextLength: text.length,
    initialTextLength: initialText.length,
    isDisabled: isSaving || (!hasChanges && text.length === 0)
  });

  return (
    <div className="space-y-6">
      <FreeTextSection 
        freeText={text}
        onTextChange={handleTextChange}
      />
      
      <div className="space-y-4">
        <SaveButton
          userId={userId}
          freeText={text}
          hasChanges={hasChanges || text.trim().length > 0}
          loading={isSaving}
          onSaveComplete={handleSaveComplete}
          setLoading={() => {}} // We're now using the internal isSaving state
          setInitialText={setInitialText}
          setIsSaved={setIsSaved}
        />
        
        <SignButton 
          isSaved={isSaved} 
          onShowSignature={() => setShowSignatureSection(true)} 
        />
      </div>
      
      {isSaved && showSignatureSection && (
        <SignatureComponent 
          userId={userId} 
          existingSignature={signature}
          onSignatureSaved={handleSignatureSaved}
        />
      )}
    </div>
  );
}
