
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
    // For now, this is a placeholder. In a real implementation,
    // we would fetch this data from the database where the user has stored their selected phrases.
    // Currently, the example doesn't have a database table for this.
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
        // Don't override the signature from useSignature hook
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
      
      // 1. Save the signature first
      await saveSignature();
      
      // 2. Save or update the synthesis record
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
      if (!signature) {
        toast({
          title: "Signature requise",
          description: "Veuillez signer le document avant de générer le PDF",
          variant: "destructive"
        });
        return;
      }
      
      // Capture the HTML content for PDF generation
      if (signatureRef.current) {
        // Call the PDF generation function
        await generatePDF({
          profileData,
          responses,
          examplePhrases,
          customPhrases,
          trustedPersons,
          freeText,
          signature,
          userId
        });
        
        toast({
          title: "PDF généré",
          description: "Votre document PDF a été généré et téléchargé"
        });
      }
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive"
      });
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
          {/* Profile information */}
          <ProfileSection profileData={profileData} />
          
          {/* Trusted persons */}
          <TrustedPersonsSection trustedPersons={trustedPersons} />
          
          {/* Questionnaire responses */}
          <QuestionnairesSection responses={responses} />
          
          {/* Example phrases and custom phrases */}
          <ExamplesSection 
            examplePhrases={examplePhrases} 
            customPhrases={customPhrases} 
          />
          
          {/* Free text section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Précisions complémentaires</h3>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              className="w-full h-32 p-3 border rounded-md"
              placeholder="Ajoutez des précisions complémentaires ici..."
            />
          </div>
          
          {/* Signature section */}
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
              onSave={setSignature}
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
        >
          <Download size={16} />
          Générer PDF
        </Button>
      </div>
    </div>
  );
};

export default SynthesisContent;
