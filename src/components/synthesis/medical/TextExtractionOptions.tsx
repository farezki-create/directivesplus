
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Image, 
  Type, 
  ClipboardPaste,
  Zap
} from "lucide-react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useOcrExtraction } from "@/hooks/useOcrExtraction";
import { useClipboardOperations } from "@/hooks/useClipboardOperations";
import ExtractionMethodCard from "./ExtractionMethodCard";
import StatusIndicators from "./StatusIndicators";
import ContentEditor from "./ContentEditor";

interface TextExtractionOptionsProps {
  extractedText: string;
  setExtractedText: (text: string) => void;
  onSave: () => void;
  isSaving: boolean;
  documentName: string;
}

const TextExtractionOptions: React.FC<TextExtractionOptionsProps> = ({
  extractedText,
  setExtractedText,
  onSave,
  isSaving,
  documentName
}) => {
  const [activeMethod, setActiveMethod] = useState<string>('manual');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isRecording, startVoiceRecording, stopVoiceRecording } = useVoiceRecognition(extractedText, setExtractedText);
  const { isOcrProcessing, handleImageUpload } = useOcrExtraction(extractedText, setExtractedText);
  const { handlePasteFromClipboard } = useClipboardOperations(extractedText, setExtractedText);

  const handleManualEntry = () => {
    const template = `Contenu médical extrait de: ${documentName}

Date du document: 
Type de document: 
Médecin/Institution: 

Informations importantes:
- 
- 
- 

Détails médicaux:


Recommandations:


Notes personnelles:
`;
    setExtractedText(template);
    setActiveMethod('manual');
  };

  const extractionMethods = [
    {
      id: 'manual',
      title: 'Saisie manuelle',
      description: 'Tapez ou dictez le contenu directement',
      icon: Type,
      action: handleManualEntry,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      id: 'voice',
      title: 'Dictée vocale',
      description: 'Utilisez la reconnaissance vocale',
      icon: isRecording ? MicOff : Mic,
      action: isRecording ? stopVoiceRecording : startVoiceRecording,
      color: isRecording ? 'bg-red-50 hover:bg-red-100 border-red-200' : 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      id: 'ocr',
      title: 'Photo du document',
      description: 'Prenez une photo et extrayez le texte automatiquement',
      icon: Image,
      action: () => fileInputRef.current?.click(),
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    },
    {
      id: 'paste',
      title: 'Coller du texte',
      description: 'Collez depuis le presse-papier',
      icon: ClipboardPaste,
      action: handlePasteFromClipboard,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Méthodes d'extraction de texte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {extractionMethods.map((method) => (
              <ExtractionMethodCard
                key={method.id}
                {...method}
                activeMethod={activeMethod}
              />
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <StatusIndicators 
            isRecording={isRecording}
            isOcrProcessing={isOcrProcessing}
          />
        </CardContent>
      </Card>

      <ContentEditor
        extractedText={extractedText}
        setExtractedText={setExtractedText}
        onSave={onSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default TextExtractionOptions;
