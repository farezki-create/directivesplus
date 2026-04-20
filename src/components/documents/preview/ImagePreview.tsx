
interface ImagePreviewProps {
  filePath: string;
}

const ImagePreview = ({ filePath }: ImagePreviewProps) => {
  return (
    <div className="flex justify-center py-4">
      <img loading="lazy" decoding="async" 
        src={filePath} 
        alt="Prévisualisation" 
        className="max-h-[70vh] object-contain" 
      />
    </div>
  );
};

export default ImagePreview;
