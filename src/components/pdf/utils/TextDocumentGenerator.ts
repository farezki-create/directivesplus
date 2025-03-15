
import { TrustedPerson, UserProfile } from "../types";
import { QuestionnaireResponses } from "../types/questionnaireResponses";
import { formatResponseText } from "@/components/free-text/ResponseFormatter";

export class TextDocumentGenerator {
  static generate(
    profile: UserProfile | null,
    responses: QuestionnaireResponses,
    synthesis: any,
    trustedPersons: TrustedPerson[]
  ): string {
    console.log("[TextDocumentGenerator] Generating text document with data:", {
      profile: profile ? "available" : "null",
      responses: responses ? "available" : "null",
      synthesis: synthesis ? "available" : "null",
      trustedPersons: trustedPersons?.length
    });
    
    let textDoc = "";
    
    // Add header with date
    const date = new Date();
    const dateStr = date.toLocaleDateString('fr-FR');
    textDoc += `DIRECTIVES ANTICIPÉES\nDocument établi le ${dateStr}\n\n`;
    
    // Add profile information
    if (profile) {
      textDoc += `INFORMATIONS PERSONNELLES\n`;
      textDoc += `Prénom: ${profile.first_name || 'Non renseigné'}\n`;
      textDoc += `Nom: ${profile.last_name || 'Non renseigné'}\n`;
      textDoc += `Date de naissance: ${profile.birth_date || 'Non renseignée'}\n`;
      textDoc += `Adresse: ${profile.address || 'Non renseignée'}\n`;
      if (profile.postal_code) textDoc += `Code postal: ${profile.postal_code}\n`;
      if (profile.city) textDoc += `Ville: ${profile.city}\n`;
      textDoc += `\n`;
    }
    
    // Add responses by category with proper formatting
    if (responses.general && responses.general.length > 0) {
      textDoc += `OPINION GÉNÉRALE\n`;
      responses.general.forEach(item => {
        const question = item.question_text || 'Question non disponible';
        const formattedResponse = formatResponseText(item.response);
        textDoc += `- Question: ${question}\n`;
        textDoc += `  Réponse: ${formattedResponse}\n\n`;
      });
    }
    
    if (responses.lifeSupport && responses.lifeSupport.length > 0) {
      textDoc += `MAINTIEN ARTIFICIEL DE LA VIE\n`;
      responses.lifeSupport.forEach(item => {
        const question = item.question_text || 'Question non disponible';
        const formattedResponse = formatResponseText(item.response);
        textDoc += `- Question: ${question}\n`;
        textDoc += `  Réponse: ${formattedResponse}\n\n`;
      });
    }
    
    if (responses.advancedIllness && responses.advancedIllness.length > 0) {
      textDoc += `MALADIE GRAVE\n`;
      responses.advancedIllness.forEach(item => {
        const question = item.question_text || 'Question non disponible';
        const formattedResponse = formatResponseText(item.response);
        textDoc += `- Question: ${question}\n`;
        textDoc += `  Réponse: ${formattedResponse}\n\n`;
      });
    }
    
    if (responses.preferences && responses.preferences.length > 0) {
      textDoc += `PRÉFÉRENCES\n`;
      responses.preferences.forEach(item => {
        const question = item.question_text || 'Question non disponible';
        const formattedResponse = formatResponseText(item.response);
        textDoc += `- Question: ${question}\n`;
        textDoc += `  Réponse: ${formattedResponse}\n\n`;
      });
    }
    
    // Add synthesis if available
    if (synthesis && synthesis.free_text) {
      textDoc += `SYNTHÈSE\n${synthesis.free_text}\n\n`;
    }
    
    // Add trusted persons if available
    if (trustedPersons && trustedPersons.length > 0) {
      textDoc += `PERSONNES DE CONFIANCE\n`;
      trustedPersons.forEach((person, index) => {
        textDoc += `Personne de confiance ${index + 1}:\n`;
        textDoc += `Nom: ${person.name || 'Non renseigné'}\n`;
        if (person.relation) textDoc += `Relation: ${person.relation}\n`;
        if (person.phone) textDoc += `Téléphone: ${person.phone}\n`;
        if (person.email) textDoc += `Email: ${person.email}\n`;
        if (person.address) textDoc += `Adresse: ${person.address}\n`;
        if (person.city) textDoc += `Ville: ${person.city}\n`;
        if (person.postal_code) textDoc += `Code postal: ${person.postal_code}\n`;
        textDoc += `\n`;
      });
    }
    
    // Add signature placeholder
    textDoc += `SIGNATURE\n`;
    textDoc += `Date: ${dateStr}\n`;
    textDoc += `Signature: ________________________________\n`;
    
    console.log("[TextDocumentGenerator] Document generated successfully");
    return textDoc;
  }
}
