
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 640, // Format carte bancaire 85.6mm * 300dpi / 25.4
        height: 403, // Format carte bancaire 53.98mm * 300dpi / 25.4
      });

      const link = document.createElement('a');
      link.download = `carte-acces-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const printCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 640,
        height: 403,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', [85.6, 53.98]); // Format carte bancaire
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
      
      // Ouvrir dans une nouvelle fenêtre pour impression
      const pdfUrl = pdf.output('bloburl');
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'impression:', error);
    }
  };

  return (
    <div className="space-y-4">
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
      <div className="flex gap-2 justify-center">
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
    </div>
  );
};
