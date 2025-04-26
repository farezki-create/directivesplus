
import { useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface PDFGenerationSafetyTimeoutProps {
  isGenerating: boolean;
  pdfUrl: string | null;
  setIsGenerating: (value: boolean) => void;
  setErrorCount: (cb: (prev: number) => number) => void;
}

export function PDFGenerationSafetyTimeout({
  isGenerating,
  pdfUrl,
  setIsGenerating,
  setErrorCount
}: PDFGenerationSafetyTimeoutProps) {
  useEffect(() => {
    let safetyTimeout: NodeJS.Timeout | null = null;
    
    if (isGenerating) {
      safetyTimeout = setTimeout(() => {
        console.log("[PDFMainGenerator] Safety timeout triggered - generation taking too long");
        if (!pdfUrl) {
          toast({
            title: "Génération prolongée",
            description: "La génération prend plus de temps que prévu, veuillez patienter...",
          });
        }
      }, 15000);
      
      const forceCompletionTimeout = setTimeout(() => {
        if (isGenerating && !pdfUrl) {
          console.log("[PDFMainGenerator] Force timeout triggered - resetting generation state");
          setIsGenerating(false);
          setErrorCount(prev => prev + 1);
          
          toast({
            title: "Problème de génération",
            description: "La génération a pris trop de temps. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      }, 25000);
      
      return () => {
        if (safetyTimeout) clearTimeout(safetyTimeout);
        clearTimeout(forceCompletionTimeout);
      };
    }
    
    return undefined;
  }, [isGenerating, pdfUrl, setIsGenerating, setErrorCount]);

  return null;
}
