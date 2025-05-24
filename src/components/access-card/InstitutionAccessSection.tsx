
import { useInstitutionCodeGeneration } from "@/hooks/useInstitutionCodeGeneration";
import InstitutionAccessCard from "./InstitutionAccessCard";
import InstitutionCodeDialog from "./InstitutionCodeDialog";

interface InstitutionAccessSectionProps {
  userId?: string;
}

const InstitutionAccessSection = ({ userId }: InstitutionAccessSectionProps) => {
  const {
    institutionCode,
    isGenerating,
    copied,
    isDialogOpen,
    handleGenerateInstitutionCode,
    copyToClipboard,
    handleDialogClose
  } = useInstitutionCodeGeneration();

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
