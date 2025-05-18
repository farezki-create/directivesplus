
import AudioPreview from "./AudioPreview";
import PdfPreview from "./PdfPreview";
import ImagePreview from "./ImagePreview";
import GenericPreview from "./GenericPreview";
import { detectDocumentType } from "./documentUtils";

interface PreviewContentProps {
  filePath: string | null;
  onOpenExternal: () => void;
}

const PreviewContent = ({ filePath, onOpenExternal }: PreviewContentProps) => {
  if (!filePath) return null;

  const { isAudio, isPdf, isImage } = detectDocumentType(filePath);

  if (isAudio) {
    return <AudioPreview filePath={filePath} />;
  }

  if (isPdf) {
    return <PdfPreview filePath={filePath} />;
  }

  if (isImage) {
    return <ImagePreview filePath={filePath} />;
  }

  return <GenericPreview filePath={filePath} onOpenExternal={onOpenExternal} />;
};

export default PreviewContent;
