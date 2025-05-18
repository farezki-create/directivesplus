
interface PdfPreviewProps {
  filePath: string;
}

const PdfPreview = ({ filePath }: PdfPreviewProps) => {
  return (
    <iframe 
      src={filePath} 
      className="w-full h-[70vh]" 
      title="Prévisualisation PDF"
    />
  );
};

export default PdfPreview;
