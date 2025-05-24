
import { useSharing } from "@/hooks/sharing/useSharing";
import InstitutionAccessCard from "./InstitutionAccessCard";
import InstitutionCodeDialog from "./InstitutionCodeDialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface InstitutionAccessSectionProps {
  userId?: string;
}

const InstitutionAccessSection = ({ userId }: InstitutionAccessSectionProps) => {
  const [institutionCode, setInstitutionCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { generateInstitutionCode, isGenerating } = useSharing();

  const handleGenerateInstitutionCode = async (userId: string) => {
    try {
      // Get the user's directives
      const { data: directives, error } = await supabase
        .from('directives')
        .select('*')
        .eq('user_id', userId)
        .limit(1);

      if (error || !directives || directives.length === 0) {
        toast({
          title: "Aucune directive trouvée",
          description: "Vous devez d'abord créer des directives anticipées",
          variant: "destructive"
        });
        return;
      }

      const directive = directives[0];
      const shareableDocument = {
        id: directive.id,
        file_name: "Directives anticipées",
        file_path: "",
        created_at: directive.created_at,
        user_id: directive.user_id,
        file_type: "directive" as const,
        source: "directives" as const,
        content: directive.content
      };

      const code = await generateInstitutionCode(shareableDocument, 30);
      if (code) {
        setInstitutionCode(code);
        setIsDialogOpen(true);
      }
    } catch (err: any) {
      console.error("Erreur génération code institution:", err);
      toast({
        title: "Erreur",
        description: "Impossible de générer le code d'accès",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = () => {
    if (institutionCode) {
      navigator.clipboard.writeText(institutionCode);
      setCopied(true);
      toast({
        title: "Code copié",
        description: "Le code d'accès a été copié dans le presse-papier."
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setInstitutionCode(null);
    setCopied(false);
  };

  const handleGenerateCode = () => {
    if (userId) {
      handleGenerateInstitutionCode(userId);
    }
  };

  return (
    <>
      <InstitutionAccessCard
        userId={userId}
        isGenerating={isGenerating}
        onGenerateCode={handleGenerateCode}
      />

      <InstitutionCodeDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        institutionCode={institutionCode}
        copied={copied}
        onCopyCode={copyToClipboard}
      />
    </>
  );
};

export default InstitutionAccessSection;
