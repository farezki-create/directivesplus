
import { PDFActionButtons } from "./PDFActionButtons";
import { DirectDownloadButtons } from "./DirectDownloadButtons";
import { DMPButton } from "./DMPButton";

interface PDFActionContainerProps {
  onDownload: () => void;
  loadError: boolean;
  onRetry?: () => void;
  onDirectDownload?: () => void;
  onOpenInNewTab?: () => void;
}

export function PDFActionContainer({
  onDownload,
  loadError,
  onRetry,
  onDirectDownload,
  onOpenInNewTab
}: PDFActionContainerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <DMPButton />
      <PDFActionButtons onDownload={onDownload} />
      
      {loadError && onRetry && onDirectDownload && onOpenInNewTab && (
        <DirectDownloadButtons 
          onRetry={onRetry}
          onDirectDownload={onDirectDownload}
          onOpenInNewTab={onOpenInNewTab}
        />
      )}
    </div>
  );
}
