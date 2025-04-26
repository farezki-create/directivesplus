
import { Progress } from "@/components/ui/progress";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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
  isCard = false
}: PDFGenerationOverlayProps) {
  const [animationClass, setAnimationClass] = useState("animate-pulse");
  const [iconAnimation, setIconAnimation] = useState("animate-bounce");
  const [rainbowOpacity, setRainbowOpacity] = useState(0.7);
  
  // Cycle through different animation classes for both text and icons
  useEffect(() => {
    if (isGenerating) {
      const textAnimations = ["animate-pulse", "animate-fade-in", "animate-pulse"];
      const iconAnimations = ["animate-bounce", "animate-spin", "animate-pulse"];
      
      const textInterval = setInterval(() => {
        setAnimationClass((prev) => {
          const currentIndex = textAnimations.indexOf(prev);
          return textAnimations[(currentIndex + 1) % textAnimations.length];
        });
      }, 1500);
      
      const iconInterval = setInterval(() => {
        setIconAnimation((prev) => {
          const currentIndex = iconAnimations.indexOf(prev);
          return iconAnimations[(currentIndex + 1) % iconAnimations.length];
        });
      }, 2000);

      // Rainbow animation effect
      const rainbowInterval = setInterval(() => {
        setRainbowOpacity(prev => prev === 0.7 ? 0.9 : 0.7);
      }, 1000);
      
      return () => {
        clearInterval(textInterval);
        clearInterval(iconInterval);
        clearInterval(rainbowInterval);
      };
    }
  }, [isGenerating]);

  if (!isGenerating) return null;

  // Couleurs spécifiques selon le type de document
  const accentColor = isCard ? "indigo" : "purple";
  const iconColor = isCard ? "text-indigo-600" : "text-purple-600";
  const bgGradient = isCard 
    ? "bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100"
    : "bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100";

  return (
    <div className={`border rounded-lg p-6 mb-6 ${bgGradient} space-y-4 animate-fade-in shadow-lg`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={iconAnimation}>
          {isCard ? (
            <Sparkles className={`h-5 w-5 ${iconColor}`} />
          ) : (
            <FileText className={`h-5 w-5 ${iconColor}`} />
          )}
        </div>
        <h3 className={`font-medium text-${accentColor}-700`}>
          {isCard ? "Préparation de votre carte d'accès" : "Préparation de vos directives"}
        </h3>
      </div>
      
      <Progress 
        value={progress} 
        className={`h-2.5 bg-${accentColor}-100`} 
      />
      
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className={`h-4 w-4 animate-spin ${iconColor}`} />
        <span className={`text-${accentColor}-700 ${animationClass} font-medium`}>
          {waitingMessage || (isCard ? "Génération de votre carte en cours..." : "Génération en cours...")}
        </span>
      </div>
      
      {/* Rainbow animation effect at the bottom - plus colorée et animée */}
      <div className="relative h-2 w-full overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse"></div>
        <div 
          className="absolute inset-0 bg-gradient-to-l from-indigo-500 via-blue-400 to-cyan-400 animate-pulse"
          style={{ opacity: rainbowOpacity }}
        ></div>
      </div>
    </div>
  );
}
