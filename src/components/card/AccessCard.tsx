import React, { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessCode, generateAccessCode } from "@/hooks/useAccessCode";
import CardOptions from "./CardOptions";
import CardDisplay from "./CardDisplay";
import CardActions from "./CardActions";
import { downloadCard, printCard, shareCard } from "./utils/cardOperations";
import { toast } from "@/hooks/use-toast";

interface AccessCardProps {
  firstName: string;
  lastName: string;
  birthDate: string | null;
}

const AccessCard: React.FC<AccessCardProps> = ({ firstName, lastName, birthDate }) => {
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [includeDirective, setIncludeDirective] = useState(true);
  const [includeMedical, setIncludeMedical] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modified to use state variables to store the codes
  const [directiveCode, setDirectiveCode] = useState<string | null>(null);
  const [medicalCode, setMedicalCode] = useState<string | null>(null);
  
  // Use the hook to get the initial values
  const directiveCodeFromHook = useAccessCode(user, "directive");
  const medicalCodeFromHook = useAccessCode(user, "medical");

  // Set the initial values when they're loaded from the hook
  React.useEffect(() => {
    if (directiveCodeFromHook) {
      setDirectiveCode(directiveCodeFromHook);
    }
    if (medicalCodeFromHook) {
      setMedicalCode(medicalCodeFromHook);
    }
  }, [directiveCodeFromHook, medicalCodeFromHook]);
  
  const handleDownload = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour télécharger la carte",
        variant: "destructive"
      });
      return;
    }
    
    if (!directiveCode && includeDirective) {
      toast({
        title: "Erreur",
        description: "Le code d'accès aux directives n'a pas pu être généré",
        variant: "destructive"
      });
      return;
    }
    
    if (!medicalCode && includeMedical) {
      toast({
        title: "Erreur",
        description: "Le code d'accès médical n'a pas pu être généré",
        variant: "destructive"
      });
      return;
    }
    
    await downloadCard({
      cardRef,
      userId: user.id,
      firstName,
      lastName,
      includeDirective,
      includeMedical,
      directiveCode,
      medicalCode
    });
  };
  
  const handlePrint = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour imprimer la carte",
        variant: "destructive"
      });
      return;
    }
    
    if (!directiveCode && includeDirective) {
      toast({
        title: "Erreur",
        description: "Le code d'accès aux directives n'a pas pu être généré",
        variant: "destructive"
      });
      return;
    }
    
    if (!medicalCode && includeMedical) {
      toast({
        title: "Erreur",
        description: "Le code d'accès médical n'a pas pu être généré",
        variant: "destructive"
      });
      return;
    }
    
    await printCard({
      cardRef,
      userId: user.id,
      firstName,
      lastName,
      includeDirective,
      includeMedical,
      directiveCode,
      medicalCode
    });
  };

  // Function to handle generating/refreshing the codes
  const handleGenerateCard = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour générer la carte",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate new codes as needed
      if (includeDirective) {
        const newDirectiveCode = await generateAccessCode(user, "directive");
        setDirectiveCode(newDirectiveCode);
      }
      
      if (includeMedical) {
        const newMedicalCode = await generateAccessCode(user, "medical");
        setMedicalCode(newMedicalCode);
      }
      
      toast({
        title: "Carte générée",
        description: "La carte d'accès a été générée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la génération de la carte:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la carte d'accès",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Vérifier si les codes sont disponibles
  const isCardReady = (includeDirective && !directiveCode) || (includeMedical && !medicalCode) ? false : true;

  return (
    <div className="space-y-8">
      <CardOptions 
        includeDirective={includeDirective}
        setIncludeDirective={setIncludeDirective}
        includeMedical={includeMedical}
        setIncludeMedical={setIncludeMedical}
      />
      
      <div className="flex flex-col items-center">
        <CardDisplay 
          cardRef={cardRef}
          firstName={firstName}
          lastName={lastName}
          birthDate={birthDate}
          includeDirective={includeDirective}
          includeMedical={includeMedical}
          directiveCode={directiveCode}
          medicalCode={medicalCode}
        />
        
        <CardActions 
          onDownload={handleDownload}
          onPrint={handlePrint}
          onGenerate={handleGenerateCard}
          disabled={!includeDirective && !includeMedical || !isCardReady}
          isLoading={isGenerating}
        />
        
        {!isCardReady && !isGenerating && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
            <p>Codes d'accès manquants. Veuillez cliquer sur "Générer la carte" pour créer vos codes d'accès.</p>
          </div>
        )}
        
        {isGenerating && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
            <p>Génération des codes d'accès en cours... Veuillez patienter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessCard;
