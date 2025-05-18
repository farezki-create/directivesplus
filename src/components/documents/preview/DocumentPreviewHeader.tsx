
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DocumentPreviewHeaderProps {
  filePath: string | null;
}

const DocumentPreviewHeader = ({ filePath }: DocumentPreviewHeaderProps) => {
  // Check document type
  const isAudio = filePath && (
    filePath.includes('audio') || 
    filePath.endsWith('.mp3') || 
    filePath.endsWith('.wav') || 
    filePath.endsWith('.ogg')
  );
  
  const isPdf = filePath && (
    filePath.includes('pdf') || 
    filePath.endsWith('.pdf') || 
    filePath.includes('application/pdf')
  );
  
  const isImage = filePath && (
    filePath.includes('image') || 
    filePath.endsWith('.jpg') || 
    filePath.endsWith('.jpeg') || 
    filePath.endsWith('.png') || 
    filePath.endsWith('.gif') || 
    filePath.includes('image/jpeg') || 
    filePath.includes('image/png')
  );

  return (
    <DialogHeader>
      <DialogTitle>Prévisualisation du document</DialogTitle>
      <DialogDescription>
        {isAudio && "Écoutez votre enregistrement audio"}
        {isPdf && "Visualisez votre document PDF"}
        {isImage && "Visualisez votre image"}
        {!isAudio && !isPdf && !isImage && filePath && "Prévisualisation du document"}
      </DialogDescription>
    </DialogHeader>
  );
};

export default DocumentPreviewHeader;
