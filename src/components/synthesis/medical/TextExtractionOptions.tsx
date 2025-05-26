
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Image, 
  Type, 
  ClipboardPaste, 
  FileText,
  Upload,
  Eye,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Tesseract from 'tesseract.js';

interface TextExtractionOptionsProps {
  extractedText: string;
  setExtractedText: (text: string) => void;
  onSave: () => void;
  isSaving: boolean;
  documentName: string;
}

const TextExtractionOptions: React.FC<TextExtractionOptionsProps> = ({
  extractedText,
  setExtractedText,
  onSave,
  isSaving,
  documentName
}) => {
  const [activeMethod, setActiveMethod] = useState<string>('manual');
  const [isRecording, setIsRecording] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Méthode 1: Dictée vocale
  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Dictée non supportée",
        description: "Votre navigateur ne supporte pas la dictée vocale",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: "Dictée activée",
        description: "Parlez maintenant, le texte sera transcrit automatiquement"
      });
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setExtractedText(extractedText + ' ' + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      setIsRecording(false);
      toast({
        title: "Erreur de dictée",
        description: "Erreur lors de la reconnaissance vocale",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Méthode 2: OCR sur image
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner une image (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    setIsOcrProcessing(true);
    toast({
      title: "Analyse en cours",
      description: "Extraction du texte de l'image..."
    });

    try {
      const result = await Tesseract.recognize(file, 'fra', {
        logger: m => console.log(m)
      });
      
      const extractedOcrText = result.data.text;
      if (extractedOcrText.trim()) {
        setExtractedText(extractedText + '\n\n' + extractedOcrText);
        toast({
          title: "Texte extrait avec succès",
          description: "Le texte de l'image a été ajouté"
        });
      } else {
        toast({
          title: "Aucun texte détecté",
          description: "Aucun texte n'a pu être extrait de cette image",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur OCR:', error);
      toast({
        title: "Erreur d'extraction",
        description: "Impossible d'extraire le texte de l'image",
        variant: "destructive"
      });
    } finally {
      setIsOcrProcessing(false);
    }
  };

  // Méthode 3: Saisie manuelle améliorée
  const handleManualEntry = () => {
    const template = `Contenu médical extrait de: ${documentName}

Date du document: 
Type de document: 
Médecin/Institution: 

Informations importantes:
- 
- 
- 

Détails médicaux:


Recommandations:


Notes personnelles:
`;
    setExtractedText(template);
    setActiveMethod('manual');
  };

  // Méthode 4: Copier-coller amélioré
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setExtractedText(extractedText + '\n\n' + text);
        toast({
          title: "Texte collé",
          description: "Le contenu du presse-papier a été ajouté"
        });
      } else {
        toast({
          title: "Presse-papier vide",
          description: "Aucun texte trouvé dans le presse-papier",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Accès refusé",
        description: "Impossible d'accéder au presse-papier. Utilisez Ctrl+V dans la zone de texte.",
        variant: "destructive"
      });
    }
  };

  const extractionMethods = [
    {
      id: 'manual',
      title: 'Saisie manuelle',
      description: 'Tapez ou dictez le contenu directement',
      icon: Type,
      action: handleManualEntry,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      id: 'voice',
      title: 'Dictée vocale',
      description: 'Utilisez la reconnaissance vocale',
      icon: isRecording ? MicOff : Mic,
      action: isRecording ? stopVoiceRecording : startVoiceRecording,
      color: isRecording ? 'bg-red-50 hover:bg-red-100 border-red-200' : 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      id: 'ocr',
      title: 'Photo du document',
      description: 'Prenez une photo et extrayez le texte automatiquement',
      icon: Image,
      action: () => fileInputRef.current?.click(),
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    },
    {
      id: 'paste',
      title: 'Coller du texte',
      description: 'Collez depuis le presse-papier',
      icon: ClipboardPaste,
      action: handlePasteFromClipboard,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Options d'extraction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Méthodes d'extraction de texte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {extractionMethods.map((method) => (
              <Card 
                key={method.id}
                className={`cursor-pointer transition-all ${method.color} ${activeMethod === method.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={method.action}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <method.icon className="h-5 w-5 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">{method.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{method.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Input caché pour l'upload d'images */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Indicateurs d'état */}
          {isRecording && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-red-700">
                <Mic className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Enregistrement en cours...</span>
              </div>
            </div>
          )}

          {isOcrProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Eye className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Analyse de l'image en cours...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zone de texte */}
      <Card>
        <CardHeader>
          <CardTitle>Contenu extrait</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="Le texte extrait apparaîtra ici. Vous pouvez aussi taper directement ou utiliser Ctrl+V pour coller."
            className="min-h-64 text-sm"
          />
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-gray-500">
              {extractedText.length} caractères
            </div>
            <Button
              onClick={onSave}
              disabled={isSaving || !extractedText.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? "Sauvegarde..." : "Sauvegarder le contenu"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextExtractionOptions;
