
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, CreditCard } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

interface AccessCardProps {
  name: string;
  birthDate?: string | null;
  directivesCode?: string;
  medicalCode?: string;
}

export const AccessCard: React.FC<AccessCardProps> = ({
  name,
  birthDate,
  directivesCode,
  medicalCode
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current) {
      toast({
        title: "Erreur",
        description: "Impossible de générer la carte",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Génération en cours",
        description: "Préparation de la carte pour téléchargement..."
      });

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 3,
        width: 640,
        height: 403,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `carte-acces-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      toast({
        title: "Téléchargement terminé",
        description: "La carte d'accès a été téléchargée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la carte",
        variant: "destructive"
      });
    }
  };

  const printCard = async () => {
    if (!cardRef.current) {
      toast({
        title: "Erreur",
        description: "Impossible d'imprimer la carte",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Préparation impression",
        description: "Génération du fichier PDF pour impression..."
      });

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 3,
        width: 640,
        height: 403,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('landscape', 'mm', [85.6, 53.98]);
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
      
      // Ouvrir le PDF pour impression
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          // Nettoyer l'URL après l'impression
          setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
          }, 1000);
        };
      } else {
        // Fallback si popup bloquée
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `carte-acces-${name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        link.click();
        URL.revokeObjectURL(pdfUrl);
      }

      toast({
        title: "Prêt pour impression",
        description: "Le fichier PDF a été ouvert pour impression"
      });
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de préparer l'impression",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      <div 
        ref={cardRef}
        className="relative mx-auto"
        style={{
          width: '320px',
          height: '201px',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '20px',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}
      >
        {/* Logo/Titre */}
        <div className="text-xs font-bold mb-2 opacity-90">
          DIRECTIVES ANTICIPÉES
        </div>
        
        {/* Nom */}
        <div className="text-lg font-bold mb-1 tracking-wide">
          {name.toUpperCase()}
        </div>
        
        {/* Date de naissance */}
        {birthDate && (
          <div className="text-sm opacity-80 mb-4">
            Né(e) le {new Date(birthDate).toLocaleDateString('fr-FR')}
          </div>
        )}
        
        {/* Codes d'accès */}
        <div className="space-y-2">
          {directivesCode && (
            <div>
              <div className="text-xs opacity-80">CODE DIRECTIVES</div>
              <div className="text-lg font-mono tracking-[0.2em] font-bold">
                {directivesCode}
              </div>
            </div>
          )}
          
          {medicalCode && (
            <div>
              <div className="text-xs opacity-80">CODE MÉDICAL</div>
              <div className="text-lg font-mono tracking-[0.2em] font-bold">
                {medicalCode}
              </div>
            </div>
          )}
        </div>
        
        {/* Puce décorative */}
        <div 
          className="absolute top-5 right-5 w-8 h-6 bg-white bg-opacity-20 rounded"
          style={{ 
            background: 'linear-gradient(145deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        />
        
        {/* Texte de sécurité */}
        <div className="absolute bottom-2 right-4 text-xs opacity-60">
          ACCÈS SÉCURISÉ
        </div>
      </div>
      
      {/* Boutons d'action */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={downloadCard}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Télécharger
        </Button>
        <Button
          onClick={printCard}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 text-center px-4">
        <CreditCard className="h-4 w-4 inline mr-1" />
        Carte au format standard 85,6 × 53,98 mm
      </div>
    </div>
  );
};
