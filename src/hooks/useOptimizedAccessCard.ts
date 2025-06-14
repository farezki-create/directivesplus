
import { useCallback, useMemo } from "react";
import { useAccessCardGeneration } from "./access-card/useAccessCardGeneration";
import { useAccessCardPrint } from "./access-card/useAccessCardPrint";
import { useAccessCardDownload } from "./access-card/useAccessCardDownload";
import { cacheManager } from "@/utils/performance/cacheStrategy";

export const useOptimizedAccessCard = () => {
  const { codeAcces, qrCodeUrl, isGenerating, isQrCodeValid } = useAccessCardGeneration();
  const { handlePrint } = useAccessCardPrint();
  const { handleDownload } = useAccessCardDownload();

  // Mise en cache des données d'accès
  const cachedAccessData = useMemo(() => {
    if (codeAcces && qrCodeUrl) {
      const cacheKey = `access_card_${codeAcces}`;
      const cached = cacheManager.get(cacheKey);
      
      if (!cached) {
        const data = {
          codeAcces,
          qrCodeUrl,
          isQrCodeValid,
          timestamp: Date.now()
        };
        cacheManager.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes
        return data;
      }
      
      return cached;
    }
    
    return { codeAcces, qrCodeUrl, isQrCodeValid, timestamp: Date.now() };
  }, [codeAcces, qrCodeUrl, isQrCodeValid]);

  // Optimisation des handlers avec useCallback
  const optimizedHandlePrint = useCallback(() => {
    console.log("Optimized print handler called");
    handlePrint();
  }, [handlePrint]);

  const optimizedHandleDownload = useCallback(() => {
    console.log("Optimized download handler called");
    handleDownload();
  }, [handleDownload]);

  return {
    codeAcces: cachedAccessData.codeAcces,
    qrCodeUrl: cachedAccessData.qrCodeUrl,
    isGenerating,
    isQrCodeValid: cachedAccessData.isQrCodeValid,
    handlePrint: optimizedHandlePrint,
    handleDownload: optimizedHandleDownload
  };
};
