
import { useSharing } from "@/hooks/sharing/useSharing";
import InstitutionAccessCard from "./InstitutionAccessCard";
import InstitutionCodeDialog from "./InstitutionCodeDialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface InstitutionAccessSectionProps {
  userId?: string;
}

const InstitutionAccessSection = ({ userId }: InstitutionAccessSectionProps) => {
  const [institutionCode, setInstitutionCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { generateGlobalCode, isGenerating } = useSharing();

  const handleGenerateInstitutionCode = async (userId: string) => {
    try {
      // Générer un code global pour tous les documents de l'utilisateur
      const code = await generateGlobalCode(userId, {
        expiresInDays: 30,
        accessType: 'institution'
      });
      
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
