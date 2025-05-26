
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Save, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SignatureCanvasProps {
  initialSignature?: string | null;
  onSave: (signature: string) => void;
}

const SignatureCanvas = ({ initialSignature, onSave }: SignatureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  // Initialize canvas and load initial signature if provided
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the 2D rendering context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set actual canvas dimensions to match display size
    // This is crucial for proper coordinate mapping
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load initial signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasSignature(true);
        setIsValidated(true);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent): { x: number, y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let x, y;

    // Check if it's a touch event
    if ((e as TouchEvent).touches) {
      const touchEvent = e as TouchEvent;
      x = touchEvent.touches[0].clientX - rect.left;
      y = touchEvent.touches[0].clientY - rect.top;
    } else {
      // It's a mouse event
      const mouseEvent = e as MouseEvent;
      x = mouseEvent.clientX - rect.left;
      y = mouseEvent.clientY - rect.top;
    }

    // Scale coordinates based on canvas dimensions
    x = (x / rect.width) * canvas.width;
    y = (y / rect.height) * canvas.height;

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    setIsValidated(false); // Reset validation when drawing

    // Get the coordinates and start a new path
    const { x, y } = getCoordinates(e.nativeEvent);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Prevent scrolling when drawing on touch devices
    if ((e.nativeEvent as TouchEvent).touches) {
      e.preventDefault();
    }

    // Get the coordinates and continue the path
    const { x, y } = getCoordinates(e.nativeEvent);
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setHasSignature(false);
    setIsValidated(false);
    onSave(""); // Clear the saved signature
    
    toast({
      title: "Signature effacée",
      description: "Le canevas de signature a été nettoyé"
    });
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const signature = canvas.toDataURL("image/png");
      onSave(signature);
      setIsValidated(true);
      
      toast({
        title: "Signature validée",
        description: "Votre signature a été enregistrée avec succès",
        duration: 3000
      });
    } catch (error) {
      console.error("Error saving signature:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la signature",
        variant: "destructive"
      });
      // If there's an error, still provide feedback but with a generic signature
      onSave("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVQI12P4//8/AAX+Av7czFnnAAAAAElFTkSuQmCC");
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-2 bg-white">
        <canvas
          ref={canvasRef}
          className="w-full border border-dashed border-gray-300 touch-none h-[200px]"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      {isValidated && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">Signature validée et enregistrée</span>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={clearCanvas}
          className="flex items-center gap-2"
        >
          <Trash size={16} />
          Effacer
        </Button>
        <Button
          type="button"
          onClick={saveSignature}
          disabled={!hasSignature}
          variant={isValidated ? "secondary" : "default"}
          className="flex items-center gap-2"
        >
          {isValidated ? <Check size={16} /> : <Save size={16} />}
          {isValidated ? "Signature validée" : "Valider la signature"}
        </Button>
      </div>
      <p className="text-sm text-gray-500 text-center">
        Signez dans la zone ci-dessus en utilisant votre souris ou votre doigt sur un écran tactile.
      </p>
    </div>
  );
};

export default SignatureCanvas;
