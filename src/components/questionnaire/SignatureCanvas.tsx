
import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Trash2, Download } from "lucide-react";

const SignatureCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    if (!hasSignature) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord signer avant de sauvegarder",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Signature sauvegardée",
      description: "Votre signature a été enregistrée avec succès"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signez vos directives anticipées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Signez dans le cadre ci-dessous pour officialiser vos directives anticipées.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full h-48 border border-gray-200 rounded cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={clearSignature}
            disabled={!hasSignature}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Effacer
          </Button>
          <Button
            onClick={saveSignature}
            disabled={!hasSignature}
          >
            <Download className="w-4 h-4 mr-2" />
            Sauvegarder la signature
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureCanvas;
