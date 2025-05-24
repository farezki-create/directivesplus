
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, FileText, Activity } from "lucide-react";

interface AccessCardProps {
  name: string;
  birthDate?: string;
  directivesCode?: string;
  medicalCode?: string;
}

export const AccessCard: React.FC<AccessCardProps> = ({
  name,
  birthDate,
  directivesCode,
  medicalCode
}) => {
  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions carte bancaire standard (85.60 × 53.98 mm) à 300 DPI
    const width = 1012;
    const height = 638;
    canvas.width = width;
    canvas.height = height;

    // Fond dégradé violet
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#6D28D9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Coins arrondis
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 24);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Titre
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('DirectivesPlus', 50, 80);
    
    ctx.font = '18px Arial';
    ctx.fillText("Carte d'accès personnelle", 50, 110);

    // Nom
    ctx.font = 'bold 32px Arial';
    ctx.fillText(name.toUpperCase(), 50, 200);

    // Date de naissance
    if (birthDate) {
      ctx.font = '16px Arial';
      ctx.fillText(`Né(e) le: ${new Date(birthDate).toLocaleDateString('fr-FR')}`, 50, 230);
    } else {
      ctx.font = '16px Arial';
      ctx.fillText('Né(e) le: Non renseignée', 50, 230);
    }

    // Sections codes avec fond semi-transparent
    const drawCodeSection = (y: number, icon: string, title: string, code: string) => {
      // Fond de la section
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(50, y, width - 100, 80);
      
      // Bordure arrondie
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(50, y, width - 100, 80, 12);
      ctx.stroke();

      // Titre
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${icon} ${title}:`, 70, y + 30);
      
      // Code
      ctx.font = 'bold 24px monospace';
      ctx.fillText(code, 70, y + 60);
    };

    // Directives anticipées
    if (directivesCode) {
      drawCodeSection(300, '📄', 'Directives anticipées', directivesCode);
    }

    // Données médicales
    if (medicalCode) {
      drawCodeSection(420, '🩺', 'Données médicales', medicalCode);
    }

    // Logo (simulé)
    ctx.fillStyle = 'white';
    ctx.fillRect(width - 120, 40, 70, 70);
    ctx.fillStyle = '#8B5CF6';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('DirectivesPlus', width - 110, 80);

    // Télécharger
    const link = document.createElement('a');
    link.download = `carte-acces-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cardHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Carte d'accès - ${name}</title>
          <style>
            @media print {
              @page { 
                size: 85.6mm 53.98mm; 
                margin: 0; 
              }
            }
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background: linear-gradient(135deg, #8B5CF6, #6D28D9);
              color: white;
              width: 85.6mm;
              height: 53.98mm;
              padding: 8mm;
              box-sizing: border-box;
              border-radius: 6mm;
              overflow: hidden;
            }
            .header {
              font-size: 7pt;
              font-weight: bold;
              margin-bottom: 2mm;
            }
            .subtitle {
              font-size: 4.5pt;
              margin-bottom: 4mm;
            }
            .name {
              font-size: 8pt;
              font-weight: bold;
              margin-bottom: 1mm;
            }
            .birthdate {
              font-size: 4pt;
              margin-bottom: 4mm;
            }
            .code-section {
              background: rgba(255, 255, 255, 0.15);
              padding: 2mm;
              margin: 1mm 0;
              border-radius: 2mm;
              border: 0.5pt solid rgba(255, 255, 255, 0.3);
            }
            .code-title {
              font-size: 4pt;
              font-weight: bold;
              margin-bottom: 1mm;
            }
            .code {
              font-size: 6pt;
              font-family: monospace;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">DirectivesPlus</div>
          <div class="subtitle">Carte d'accès personnelle</div>
          <div class="name">${name.toUpperCase()}</div>
          <div class="birthdate">Né(e) le: ${birthDate ? new Date(birthDate).toLocaleDateString('fr-FR') : 'Non renseignée'}</div>
          ${directivesCode ? `
            <div class="code-section">
              <div class="code-title">📄 Directives anticipées:</div>
              <div class="code">${directivesCode}</div>
            </div>
          ` : ''}
          ${medicalCode ? `
            <div class="code-section">
              <div class="code-title">🩺 Données médicales:</div>
              <div class="code">${medicalCode}</div>
            </div>
          ` : ''}
        </body>
      </html>
    `;

    printWindow.document.write(cardHtml);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-4">
      {/* Aperçu de la carte */}
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-lg" style={{ aspectRatio: '85.6/53.98' }}>
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">DirectivesPlus</h3>
                <p className="text-xs opacity-90">Carte d'accès personnelle</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">DP</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-xl font-bold">{name.toUpperCase()}</h4>
              <p className="text-xs opacity-90">
                Né(e) le: {birthDate ? new Date(birthDate).toLocaleDateString('fr-FR') : 'Non renseignée'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {directivesCode && (
              <div className="bg-white/15 p-2 rounded-lg border border-white/30">
                <div className="flex items-center gap-1 mb-1">
                  <FileText className="h-3 w-3" />
                  <span className="text-xs font-bold">Directives anticipées:</span>
                </div>
                <span className="font-mono text-sm font-bold">{directivesCode}</span>
              </div>
            )}
            
            {medicalCode && (
              <div className="bg-white/15 p-2 rounded-lg border border-white/30">
                <div className="flex items-center gap-1 mb-1">
                  <Activity className="h-3 w-3" />
                  <span className="text-xs font-bold">Données médicales:</span>
                </div>
                <span className="font-mono text-sm font-bold">{medicalCode}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Boutons d'action */}
      <div className="flex gap-2 justify-center">
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Imprimer
        </Button>
      </div>
    </div>
  );
};
