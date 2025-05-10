
import { useState } from "react";

/**
 * Hook for tracking progress of operations
 */
export function useProgressTracker() {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const startProgress = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  const completeProgress = () => {
    setProgress(100);
    setTimeout(() => {
      setIsProcessing(false);
      setProgress(0);
    }, 500);
  };

  return {
    progress,
    isProcessing,
    startProgress,
    completeProgress
  };
}
