
import { UserProfile } from "../types";
import { PDFMainGenerator } from "../PDFMainGenerator";

interface AccessCardGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText: string;
  profile: UserProfile | null;
  responses: any;
}

export function AccessCardGenerator({
  userId,
  onPdfGenerated,
  synthesisText,
  profile,
  responses
}: AccessCardGeneratorProps) {
  console.log("[AccessCardGenerator] Initializing with userId:", userId);
  console.log("[AccessCardGenerator] Generating card format");

  return (
    <PDFMainGenerator 
      userId={userId} 
      onPdfGenerated={onPdfGenerated} 
      synthesisText={synthesisText} 
      profile={profile} 
      responses={responses} 
      trustedPersons={[]} 
      isCard={true} 
    />
  );
}
