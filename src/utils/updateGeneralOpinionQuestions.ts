
import { supabase } from "@/integrations/supabase/client";

const newGeneralOpinionQuestions = [
  { 
    display_order: 1, 
    question: "Souhaitez-vous recevoir tous les traitements possibles pour prolonger votre vie, même dans des conditions difficiles ?" 
  },
  { 
    display_order: 2, 
    question: "Acceptez-vous que l'équipe médicale prenne les décisions concernant vos soins, sans acharnement thérapeutique ?" 
  },
  { 
    display_order: 3, 
    question: "Êtes-vous d'accord pour recevoir des traitements efficaces contre la douleur, même s'ils peuvent potentiellement raccourcir votre vie ?" 
  },
  { 
    display_order: 4, 
    question: "En cas de dépendance totale, refusez-vous d'être maintenu en vie par hydratation et alimentation artificielles ?" 
  },
  { 
    display_order: 5, 
    question: "Est-il important pour vous de rester conscient et capable de communiquer ?" 
  },
  { 
    display_order: 6, 
    question: "Souhaitez-vous finir vos jours à domicile, entouré de vos proches, avec une gestion efficace de la douleur ?" 
  },
  { 
    display_order: 7, 
    question: "Désirez-vous que vos valeurs culturelles, spirituelles ou religieuses soient prises en compte ?" 
  },
  { 
    display_order: 8, 
    question: "Est-il important pour vous d'avoir vos proches à vos côtés ?" 
  },
  { 
    display_order: 9, 
    question: "Craignez-vous d'être un fardeau pour votre famille ?" 
  },
  { 
    display_order: 10, 
    question: "Souhaitez-vous résoudre les conflits existants avant votre décès ?" 
  },
  { 
    display_order: 11, 
    question: "Acceptez-vous de faire don de vos organes après votre mort ?" 
  },
  { 
    display_order: 12, 
    question: "Voulez-vous que vos proches acceptent votre décès avec sérénité ?" 
  }
];

export async function updateGeneralOpinionQuestions() {
  try {
    console.log("Starting to update general opinion questions...");
    
    // First, clear existing questions
    const { error: deleteError } = await supabase
      .from('questionnaire_general_fr')
      .delete()
      .not('id', 'is', null); // Safer way to delete all records
    
    if (deleteError) {
      console.error("Error deleting existing questions:", deleteError);
      throw deleteError;
    }
    
    console.log("Successfully deleted existing questions, now inserting new ones...");
    
    // Insert new questions
    const { data, error } = await supabase
      .from('questionnaire_general_fr')
      .insert(newGeneralOpinionQuestions)
      .select();
    
    if (error) {
      console.error("Error inserting new questions:", error);
      throw error;
    }
    
    console.log("Successfully updated general opinion questions:", data);
    return data;
  } catch (error) {
    console.error("Error updating general opinion questions:", error);
    throw error;
  }
}

// Add this line to make the function run once when the file is imported
// This is useful for development to automatically update the questions
// Remove this line in production
// updateGeneralOpinionQuestions().catch(console.error);
