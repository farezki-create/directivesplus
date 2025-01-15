import { Mail, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export const PDFGenerator = () => {
  const generatePDF = () => {
    // TODO: Implement PDF generation
    console.log("Generating PDF...");
  };

  const handleEmailSend = () => {
    console.log("Sending by email...");
    // TODO: Implement email sending
  };

  const handlePostalSend = () => {
    console.log("Sending by post...");
    // TODO: Implement postal sending
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Générer vos documents</h2>
      <p className="text-muted-foreground mb-6">
        Téléchargez vos directives anticipées et la liste des personnes de confiance au format PDF.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            Récupérer les documents
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choisissez votre mode d'envoi</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={handleEmailSend}
              className="flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Envoi par mail
            </Button>
            <Button
              onClick={handlePostalSend}
              className="flex items-center justify-center gap-2"
            >
              <Package className="h-4 w-4" />
              Envoi d'une carte par courrier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};