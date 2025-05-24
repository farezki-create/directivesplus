
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
      
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
          }, 1000);
        };
      } else {
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
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Motif de fond décoratif */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Logo/Titre */}
        <div className="text-xs font-bold mb-3 opacity-90 relative z-10">
          DIRECTIVES ANTICIPÉES
        </div>
        
        {/* Nom */}
        <div className="text-lg font-bold mb-2 tracking-wide relative z-10">
          {name.toUpperCase()}
        </div>
        
        {/* Date de naissance */}
        {birthDate && (
          <div className="text-sm opacity-80 mb-4 relative z-10">
            Né(e) le {new Date(birthDate).toLocaleDateString('fr-FR')}
          </div>
        )}
        
        {/* Code d'accès - Centré et mis en évidence */}
        <div className="relative z-10">
          {directivesCode && (
            <div className="text-center">
              <div className="text-xs opacity-80 mb-1">CODE D'ACCÈS</div>
              <div 
                className="text-2xl font-mono tracking-[0.2em] font-bold p-2 rounded"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                {directivesCode}
              </div>
            </div>
          )}
          
          {medicalCode && (
            <div className="text-center">
              <div className="text-xs opacity-80 mb-1">CODE MÉDICAL</div>
              <div 
                className="text-2xl font-mono tracking-[0.2em] font-bold p-2 rounded"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                {medicalCode}
              </div>
            </div>
          )}
        </div>
        
        {/* Puce décorative */}
        <div 
          className="absolute top-5 right-5 w-10 h-7 rounded relative z-10"
          style={{ 
            background: 'linear-gradient(145deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        />
        
        {/* Texte de sécurité */}
        <div className="absolute bottom-3 right-5 text-xs opacity-60 relative z-10">
          ACCÈS SÉCURISÉ • VALIDITÉ 12 MOIS
        </div>
        
        {/* Logo DirectivesPlus discret */}
        <div className="absolute bottom-3 left-5 text-xs opacity-50 relative z-10">
          DirectivesPlus
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
        Carte au format standard 85,6 × 53,98 mm • Valable 12 mois
      </div>
    </div>
  );
};
