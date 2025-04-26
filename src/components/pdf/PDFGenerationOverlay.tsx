
// There should be an existing PDFGenerationOverlay component, updating it to handle card status
import { Progress } from "@/components/ui/progress";
import { CreditCard, FileText, Loader2 } from "lucide-react";

interface PDFGenerationOverlayProps {
  isGenerating: boolean;
  progress: number;
  waitingMessage?: string;
  isCard?: boolean;
}

export function PDFGenerationOverlay({ 
  isGenerating, 
  progress, 
  waitingMessage,
  isCard 
}: PDFGenerationOverlayProps) {
  const messages = [
    "Préparation de votre document...",
    "Organisation des informations...",
    "Génération du PDF en cours...",
    "Mise en forme du document...",
    "Finalisation..."
  ];
  
  const cardMessages = [
    "Préparation de votre carte...",
    "Mise en forme de vos informations personnelles...",
    "Génération du format carte bancaire...",
    "Mise en page de la carte...",
    "Finalisation de votre carte d'accès..."
  ];

  const getCurrentMessage = () => {
    if (waitingMessage) return waitingMessage;
    
    const messageList = isCard ? cardMessages : messages;
    const index = Math.min(
      Math.floor(progress / 20),
      messageList.length - 1
    );
    return messageList[index];
  };

  if (!isGenerating) return null;

  return (
    <div className="border rounded-lg p-6 mb-6 bg-gray-50 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        {isCard ? (
          <CreditCard className="h-5 w-5 text-purple-600" />
        ) : (
          <FileText className="h-5 w-5 text-blue-600" />
        )}
        <h3 className="font-medium">
          {isCard ? "Génération de votre carte d'accès" : "Génération de document en cours"}
        </h3>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-gray-600">{getCurrentMessage()}</span>
      </div>
    </div>
  );
}
