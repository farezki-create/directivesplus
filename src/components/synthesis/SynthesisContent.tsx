
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Download, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SignatureCanvas from "./SignatureCanvas";
import QuestionnairesSection from "./QuestionnairesSection";
import ExamplesSection from "./ExamplesSection";
import TrustedPersonsSection from "./TrustedPersonsSection";
import ProfileSection from "./ProfileSection";
import { useSignature } from "@/hooks/useSignature";
import { generatePDF } from "@/utils/pdfGenerator";

interface SynthesisContentProps {
  profileData: any;
  userId?: string;
}

const SynthesisContent = ({ profileData, userId }: SynthesisContentProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [customPhrases, setCustomPhrases] = useState<string[]>([]);
  const [examplePhrases, setExamplePhrases] = useState<string[]>([]);
  const [trustedPersons, setTrustedPersons] = useState<any[]>([]);
  const [freeText, setFreeText] = useState("");
  const signatureRef = useRef<HTMLDivElement>(null);
  const { signature, setSignature, saveSignature } = useSignature(userId);
  
  // Fetch all necessary data
  useEffect(() => {
    const fetchAllData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // 1. Fetch questionnaire responses
        await fetchQuestionnaireResponses();
        
        // 2. Fetch example phrases and custom phrases
        await fetchPhrases();
        
        // 3. Fetch trusted persons
        await fetchTrustedPersons();
        
        // 4. Fetch existing synthesis if available
        await fetchExistingSynthesis();
        
      } catch (error: any) {
        console.error("Error fetching synthesis data:", error.message);
        toast({
          title: "Erreur",
          description: "Impossible de charger toutes les données pour la synthèse",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, [userId]);

  const fetchQuestionnaireResponses = async () => {
    if (!userId) return;
    
    try {
      // Get responses from all questionnaire types
      const questionnaireTypes = ['avis-general', 'maintien-vie', 'maladie-avancee', 'gouts-peurs'];
      let allResponses: Record<string, any> = {};
      
      for (const type of questionnaireTypes) {
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('question_id, response, question_text')
          .eq('user_id', userId)
          .eq('questionnaire_type', type);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const typeResponses: Record<string, {response: string, question: string}> = {};
          
          data.forEach(item => {
            typeResponses[item.question_id] = {
              response: item.response,
              question: item.question_text
            };
          });
          
          allResponses[type] = typeResponses;
        }
      }
      
      setResponses(allResponses);
      console.log("Fetched questionnaire responses:", allResponses);
      
    } catch (error: any) {
      console.error("Error fetching questionnaire responses:", error);
      throw error;
    }
  };

  const fetchPhrases = async () => {
    // Pour l'instant, c'est un espace réservé. Dans une implémentation réelle,
    // nous récupérerions ces données de la base de données où l'utilisateur a stocké ses phrases sélectionnées.
    setExamplePhrases([]);
    setCustomPhrases([]);
  };

  const fetchTrustedPersons = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('trusted_persons')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      setTrustedPersons(data || []);
      console.log("Fetched trusted persons:", data);
      
    } catch (error: any) {
      console.error("Error fetching trusted persons:", error);
      throw error;
    }
  };

  const fetchExistingSynthesis = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('questionnaire_synthesis')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFreeText(data.free_text || "");
        // Ne pas écraser la signature du hook useSignature
        console.log("Loaded existing synthesis:", data);
      }
      
    } catch (error: any) {
      console.error("Error fetching existing synthesis:", error);
      throw error;
    }
  };

  const handleSaveSynthesis = async () => {
    if (!userId) return;
    
    try {
      setSaving(true);
      
      // 1. Enregistrer la signature d'abord
      if (!signature) {
        toast({
          title: "Attention",
          description: "Veuillez signer le document avant de l'enregistrer",
          variant: "default"
        });
        setSaving(false);
        return;
      }
      
      await saveSignature();
      
      // 2. Enregistrer ou mettre à jour l'enregistrement de synthèse
      const { data, error } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: userId,
          free_text: freeText || "",
        }, {
          onConflict: 'user_id'
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Synthèse sauvegardée",
        description: "Votre synthèse a été enregistrée avec succès"
      });
      
      console.log("Synthesis saved:", data);
      
    } catch (error: any) {
      console.error("Error saving synthesis:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la synthèse",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setGenerating(true);
      
      if (!signature) {
        toast({
          title: "Signature requise",
          description: "Veuillez signer le document avant de générer le PDF",
          variant: "destructive"
        });
        setGenerating(false);
        return;
      }
      
      // Capturer le contenu HTML pour la génération de PDF
      if (signatureRef.current) {
        // Appeler la fonction de génération de PDF
        const pdfRecord = await generatePDF({
          profileData,
          responses,
          examplePhrases,
          customPhrases,
          trustedPersons,
          freeText,
          signature,
          userId
        });
        
        if (pdfRecord) {
          toast({
            title: "PDF généré",
            description: "Votre document PDF a été généré et enregistré dans 'Mes Directives'"
          });
          
          // Optionnel: Rediriger vers la page des directives après un court délai
          setTimeout(() => {
            navigate("/mes-directives");
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/rediger")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour à la rédaction
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold text-center mb-6">
        Synthèse des Directives Anticipées
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div id="synthesis-document" className="space-y-8">
          {/* Informations du profil */}
          <ProfileSection profileData={profileData} />
          
          {/* Personnes de confiance */}
          <TrustedPersonsSection trustedPersons={trustedPersons} />
          
          {/* Réponses aux questionnaires */}
          <QuestionnairesSection responses={responses} />
          
          {/* Phrases d'exemples et phrases personnalisées */}
          <ExamplesSection 
            examplePhrases={examplePhrases} 
            customPhrases={customPhrases} 
          />
          
          {/* Section de texte libre */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Précisions complémentaires</h3>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              className="w-full h-32 p-3 border rounded-md"
              placeholder="Ajoutez des précisions complémentaires ici..."
            />
          </div>
          
          {/* Section de signature */}
          <div className="space-y-4" ref={signatureRef}>
            <h3 className="text-lg font-medium">Signature</h3>
            <p className="text-sm text-gray-600">
              Je certifie que les informations ci-dessus reflètent mes volontés.
            </p>
            <div className="text-right text-sm text-gray-600">
              Date: {new Date().toLocaleDateString('fr-FR')}
            </div>
            <SignatureCanvas 
              initialSignature={signature} 
              onSave={(sig) => {
                setSignature(sig);
                toast({
                  title: "Signature enregistrée",
                  description: "Votre signature a été capturée avec succès"
                });
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Button
          variant="default"
          onClick={handleSaveSynthesis}
          className="flex items-center gap-2"
          disabled={saving}
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          ) : (
            <Save size={16} />
          )}
          Enregistrer
        </Button>
        
        <Button
          variant="outline"
          onClick={handleGeneratePDF}
          className="flex items-center gap-2"
          disabled={generating}
        >
          {generating ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-directiveplus-600"></div>
          ) : (
            <Download size={16} />
          )}
          Générer PDF
        </Button>
      </div>
    </div>
  );
};

export default SynthesisContent;
