
import { Progress } from "@/components/ui/progress";

interface PDFGenerationOverlayProps {
  isGenerating: boolean;
  progress: number;
  waitingMessage: string;
  transferringToCloud?: boolean;
}

export function PDFGenerationOverlay({ 
  isGenerating, 
  progress, 
  waitingMessage,
  transferringToCloud = false
}: PDFGenerationOverlayProps) {
  if (!isGenerating) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-sm p-6 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <Progress value={progress} className="h-2 w-full" />
        <p className="text-lg font-medium text-foreground animate-pulse">
          {waitingMessage}
        </p>
        {transferringToCloud && (
          <p className="text-sm text-muted-foreground">
            Votre document est en cours de transfert vers le stockage cloud sécurisé. 
            Cela garantit l'accessibilité future de vos directives.
          </p>
        )}
      </div>
    </div>
  );
}
