
import { useEffect, useState } from "react";

interface LoadingOverlayProps {
  isGenerating: boolean;
  messages: string[];
}

export function LoadingOverlay({ isGenerating, messages }: LoadingOverlayProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isGenerating, messages.length]);

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-sm p-6 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-lg font-medium text-foreground animate-pulse">
          {messages[currentMessageIndex]}
        </p>
      </div>
    </div>
  );
}
