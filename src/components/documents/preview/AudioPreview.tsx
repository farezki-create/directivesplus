
interface AudioPreviewProps {
  filePath: string;
}

const AudioPreview = ({ filePath }: AudioPreviewProps) => {
  return (
    <div className="py-4">
      <audio className="w-full" controls src={filePath}>
        Votre navigateur ne prend pas en charge la lecture audio
      </audio>
    </div>
  );
};

export default AudioPreview;
