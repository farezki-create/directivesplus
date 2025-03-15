
import { PDFGenerator } from "@/components/PDFGenerator";
import { FileText } from "lucide-react";

interface PDFGenerationSectionProps {
  userId: string;
  isVisible: boolean;
}

export function PDFGenerationSection({ userId, isVisible }: PDFGenerationSectionProps) {
  if (!isVisible) return null;
  
  return (
    <div className="mt-8 p-4 border rounded-lg bg-slate-50">
      <h3 className="text-lg font-medium mb-4">Générer votre document</h3>
      <div className="flex flex-wrap gap-4">
        <PDFGenerator userId={userId} />
      </div>
    </div>
  );
}
