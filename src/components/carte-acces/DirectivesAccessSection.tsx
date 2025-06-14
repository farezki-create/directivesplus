
import AccessCard from "./AccessCard";
import ActionButtons from "./ActionButtons";
import InstructionsCard from "./InstructionsCard";

interface DirectivesAccessSectionProps {
  firstName: string;
  lastName: string;
  birthDate: string;
  codeAcces: string;
  qrCodeUrl: string;
  isGenerating: boolean;
  isQrCodeValid: boolean;
  onPrint: () => void;
  onDownload: () => void;
}

const DirectivesAccessSection = ({
  firstName,
  lastName,
  birthDate,
  codeAcces,
  qrCodeUrl,
  isGenerating,
  isQrCodeValid,
  onPrint,
  onDownload
}: DirectivesAccessSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-directiveplus-800 mb-2">
          Carte d'Accès aux Directives Anticipées
        </h2>
        <p className="text-gray-600">
          Pour l'accès aux directives anticipées en situation d'urgence
        </p>
      </div>

      <ActionButtons onPrint={onPrint} onDownload={onDownload} />

      <div className="flex justify-center">
        <AccessCard 
          firstName={firstName} 
          lastName={lastName} 
          birthDate={birthDate} 
          codeAcces={codeAcces} 
          qrCodeUrl={qrCodeUrl}
          isGenerating={isGenerating}
          isQrCodeValid={isQrCodeValid}
        />
      </div>

      <InstructionsCard codeAcces={codeAcces} />
    </div>
  );
};

export default DirectivesAccessSection;
