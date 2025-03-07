
import { Button } from "@/components/ui/button";
import { FileText, PenTool } from "lucide-react";
import { PDFGenerator } from "@/components/PDFGenerator";
import { SignatureDialog } from "@/components/signature/SignatureDialog";
import { useState } from "react";

interface PDFGenerationSectionProps {
  userId: string;
}

export const PDFGenerationSection = ({ userId }: PDFGenerationSectionProps) => {
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);

  return (
    <div className="mt-4 space-y-4">
      <Button 
        onClick={() => setShowSignatureDialog(true)}
        className="flex items-center gap-2"
      >
        <PenTool className="h-4 w-4" />
        Signer le document
      </Button>
      <PDFGenerator userId={userId} />

      <SignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        userId={userId}
      />
    </div>
  );
};
