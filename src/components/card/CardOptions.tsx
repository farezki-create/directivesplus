
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Printer, 
  Share2
} from "lucide-react";
import { 
  downloadDocument, 
  printDocument, 
  shareDocument 
} from "@/utils/document-operations";
import html2canvas from "html2canvas";

interface CardOptionsProps {
  cardRef: React.RefObject<HTMLDivElement>;
  firstName: string;
  lastName: string;
}

const CardOptions: React.FC<CardOptionsProps> = ({
  cardRef,
  firstName,
  lastName
}) => {
  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const fileName = `carte-acces-${firstName.toLowerCase()}-${lastName.toLowerCase()}.png`;
        const canvas = await html2canvas(cardRef.current);
        const imgUrl = canvas.toDataURL("image/png");
        
        downloadDocument(imgUrl);
      } catch (error) {
        console.error("Error downloading card:", error);
      }
    }
  };

  const handlePrint = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current);
        const imgUrl = canvas.toDataURL("image/png");
        
        printDocument(imgUrl);
      } catch (error) {
        console.error("Error printing card:", error);
      }
    }
  };

  const handleShare = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current);
        const imgUrl = canvas.toDataURL("image/png");
        const title = `Carte d'accès de ${firstName} ${lastName}`;
        
        shareDocument(imgUrl, title);
      } catch (error) {
        console.error("Error sharing card:", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <h3 className="text-lg font-semibold">Options</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex gap-2 items-center"
          onClick={handleDownload}
        >
          <Download size={16} />
          Télécharger
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex gap-2 items-center"
          onClick={handlePrint}
        >
          <Printer size={16} />
          Imprimer
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex gap-2 items-center"
          onClick={handleShare}
        >
          <Share2 size={16} />
          Partager
        </Button>
      </div>
    </div>
  );
};

export default CardOptions;
