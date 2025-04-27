
import { UserProfile, TrustedPerson } from "../types";

interface DirectivePDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText: string;
  profile: UserProfile | null;
  responses: any;
  trustedPersons: TrustedPerson[];
}

export function DirectivePDFGenerator({
  userId,
  onPdfGenerated,
  synthesisText,
  profile,
  responses,
  trustedPersons
}: DirectivePDFGeneratorProps) {
  console.log("[DirectivePDFGenerator] Initializing with userId:", userId);
  console.log("[DirectivePDFGenerator] Synthesis text provided:", synthesisText ? "Yes" : "No");

  return (
    <PDFMainGenerator 
      userId={userId} 
      onPdfGenerated={onPdfGenerated} 
      synthesisText={synthesisText} 
      profile={profile} 
      responses={responses} 
      trustedPersons={trustedPersons} 
      isCard={false} 
    />
  );
}
