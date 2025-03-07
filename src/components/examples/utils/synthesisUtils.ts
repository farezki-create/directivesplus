
import { supabase } from "@/integrations/supabase/client";

export async function addPhraseToSynthesis(phrase: string, userId: string) {
  // Vérifier d'abord si une synthèse existe déjà pour cet utilisateur
  const { data: existingSynthesis, error: fetchError } = await supabase
    .from('questionnaire_synthesis')
    .select('free_text')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  let currentText = existingSynthesis?.free_text || '';

  // Diviser le texte existant en sections
  const sections = currentText.split("PERSONNE DE CONFIANCE");
  const mainText = sections[0] || '';
  const trustedPersonSection = sections.length > 1 ? sections[1] : '';

  // Éviter les doublons
  if (mainText.includes(phrase)) {
    return {
      success: false,
      isDuplicate: true
    };
  }

  // Construire le nouveau texte
  const newMainText = mainText ? `${mainText.trim()}\n\n${phrase}` : phrase;
  const newText = trustedPersonSection 
    ? `${newMainText.trim()}\n\nPERSONNE DE CONFIANCE${trustedPersonSection}`
    : newMainText;

  // Utiliser upsert avec précision sur la colonne de conflit
  const { error: upsertError } = await supabase
    .from('questionnaire_synthesis')
    .upsert({
      user_id: userId,
      free_text: newText
    }, {
      onConflict: 'user_id'
    });

  if (upsertError) {
    throw upsertError;
  }

  return {
    success: true,
    isDuplicate: false
  };
}

export async function removePhraseFromSynthesis(phrase: string, userId: string) {
  // Récupérer la synthèse existante
  const { data: existingSynthesis, error: fetchError } = await supabase
    .from('questionnaire_synthesis')
    .select('free_text')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (!existingSynthesis?.free_text) {
    return {
      success: false,
      notFound: true
    };
  }

  // Séparer le texte en sections
  const sections = existingSynthesis.free_text.split("PERSONNE DE CONFIANCE");
  const mainText = sections[0] || '';
  const trustedPersonSection = sections.length > 1 ? sections[1] : '';

  // Retirer la phrase de la section principale uniquement
  const updatedMainText = mainText
    .replace(phrase, '')
    .replace(/\n\n\n/g, '\n\n')
    .trim();

  // Reconstruire le texte complet
  const updatedText = trustedPersonSection 
    ? `${updatedMainText}\n\nPERSONNE DE CONFIANCE${trustedPersonSection}`
    : updatedMainText;

  // Mettre à jour la synthèse
  const { error: upsertError } = await supabase
    .from('questionnaire_synthesis')
    .upsert({
      user_id: userId,
      free_text: updatedText
    }, {
      onConflict: 'user_id'
    });

  if (upsertError) {
    throw upsertError;
  }

  return {
    success: true,
    notFound: false
  };
}

// Fonction pour sauvegarder la synthèse vers un service de stockage HDS
export async function saveToHDSCloud(text: string, userId: string) {
  try {
    console.log("[HDSCloud] Préparation de l'envoi des données HDS pour l'utilisateur:", userId);
    
    // Cette fonction simule l'envoi à un service HDS
    // Dans une implémentation réelle, vous devrez:
    // 1. Utiliser l'API d'un service compatible HDS (comme Atos, Orange Business Services, etc.)
    // 2. Crypter les données si nécessaire
    // 3. Suivre les protocoles spécifiques du service HDS

    // Simulation d'un appel API
    // En production, remplacez ce code par l'appel à l'API du fournisseur HDS
    const mockResponse = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          referenceId: `HDS-${Date.now()}-${userId.substring(0, 8)}`,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    });

    console.log("[HDSCloud] Données envoyées avec succès au service HDS:", mockResponse);
    
    return {
      success: true,
      status: "completed",
      details: mockResponse
    };
  } catch (error) {
    console.error("[HDSCloud] Erreur lors de l'envoi des données au service HDS:", error);
    return {
      success: false,
      status: "failed",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
}
