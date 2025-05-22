
import { Dossier } from "@/store/dossierStore";

/**
 * Récupère les directives depuis le contenu décrypté du dossier
 * @param decryptedContent Le contenu décrypté du dossier
 * @param dossierActif L'objet dossier actif
 * @returns L'objet directives
 */
export const getDirectivesFromContent = (
  decryptedContent: any,
  dossierActif: Dossier | null
): any => {
  if (!decryptedContent) return null;
  if (!dossierActif) return null;
  
  console.log("Récupération des directives depuis:", decryptedContent);
  
  // Recherche directe de directives anticipées
  if (decryptedContent.directives_anticipees) {
    console.log("Directives anticipées trouvées directement:", decryptedContent.directives_anticipees);
    return decryptedContent.directives_anticipees;
  }
  
  // Recherche sous la clé 'directives'
  if (decryptedContent.directives) {
    console.log("Directives trouvées directement:", decryptedContent.directives);
    return decryptedContent.directives;
  }
  
  // Recherche dans le contenu
  if (decryptedContent.content?.directives_anticipees) {
    return decryptedContent.content.directives_anticipees;
  }
  
  if (decryptedContent.content?.directives) {
    return decryptedContent.content.directives;
  }
  
  // Recherche dans le contenu (variante)
  if (decryptedContent.contenu?.directives_anticipees) {
    return decryptedContent.contenu.directives_anticipees;
  }
  
  if (decryptedContent.contenu?.directives) {
    return decryptedContent.contenu.directives;
  }
  
  // Si on ne trouve pas de directives, renvoyer un message d'information
  console.log("Aucune directive trouvée dans le contenu");
  return {
    "Information": "Les directives anticipées devraient s'afficher ici",
    "Statut": "En cours de chargement ou non disponibles",
    "Note": "Veuillez contacter le support si ce message persiste"
  };
};
