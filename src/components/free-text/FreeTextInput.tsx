
import { useState } from "react";
import { TextEditor } from "./components/TextEditor";
import { PDFGenerationSection } from "./components/PDFGenerationSection";

interface FreeTextInputProps {
  userId: string;
}

export const FreeTextInput = ({ userId }: FreeTextInputProps) => {
  const [showPdfGenerator, setShowPdfGenerator] = useState(false);

  const handleTextSaved = () => {
    setShowPdfGenerator(true);
  };

  return (
    <div className="space-y-4">
      <TextEditor 
        userId={userId} 
        onSaved={handleTextSaved} 
      />
      
      {showPdfGenerator && (
        <PDFGenerationSection userId={userId} />
      )}
    </div>
  );
};
