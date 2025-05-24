
import React from "react";
import { Button } from "@/components/ui/button";
import { AccessCard } from "./AccessCard";

interface ShareDialogCardProps {
  userName: string;
  userProfile: any;
  accessCode: string;
  document: any;
  onBack: () => void;
}

export const ShareDialogCard: React.FC<ShareDialogCardProps> = ({
  userName,
  userProfile,
  accessCode,
  document,
  onBack
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium mb-4">Carte d'accès personnelle</h3>
        <AccessCard
          name={userName}
          birthDate={userProfile?.birth_date}
          directivesCode={document.file_type === 'directive' ? accessCode : undefined}
          medicalCode={document.file_type !== 'directive' ? accessCode : undefined}
        />
      </div>

      <Button 
        onClick={onBack}
        variant="outline"
        className="w-full"
      >
        Retour aux options
      </Button>
    </div>
  );
};
