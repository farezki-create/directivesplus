
import { useAccessCardGeneration } from "./access-card/useAccessCardGeneration";
import { useAccessCardPrint } from "./access-card/useAccessCardPrint";
import { useAccessCardDownload } from "./access-card/useAccessCardDownload";

export const useAccessCard = () => {
  const { codeAcces, qrCodeUrl, isGenerating, isQrCodeValid } = useAccessCardGeneration();
  const { handlePrint } = useAccessCardPrint();
  const { handleDownload } = useAccessCardDownload();

  return {
    codeAcces,
    qrCodeUrl,
    isGenerating,
    isQrCodeValid,
    handlePrint,
    handleDownload
  };
};
