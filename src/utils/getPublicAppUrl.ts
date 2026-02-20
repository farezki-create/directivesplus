/**
 * Retourne l'URL de base de l'application pour les liens publics (QR codes, partages, etc.)
 * En production, utilise VITE_APP_URL si configuré, sinon window.location.origin.
 * Exclut les URLs Lovable preview/sandbox.
 */
export const getPublicAppUrl = (): string => {
  // 1. Variable d'environnement configurée (prioritaire)
  const configuredUrl = import.meta.env.VITE_APP_URL;
  if (configuredUrl && configuredUrl.trim() !== '') {
    return configuredUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  // 2. Vérifier si on est sur un domaine de production (pas Lovable preview)
  const origin = window.location.origin;
  const isLovablePreview = origin.includes('lovableproject.com') || 
                           origin.includes('lovable.app') ||
                           origin.includes('localhost');

  if (!isLovablePreview) {
    return origin;
  }

  // 3. Fallback: utiliser l'URL publiée Lovable (.lovable.app) si on est sur preview
  if (origin.includes('lovableproject.com')) {
    // Transformer preview URL en published URL
    // Preview: https://id-preview--PROJECT_ID.lovableproject.com
    // Published: https://PROJECT_ID.lovable.app
    const match = origin.match(/--([a-f0-9-]+)\.lovableproject\.com/);
    if (match) {
      return `https://${match[1]}.lovable.app`;
    }
  }

  // 4. Dernier fallback
  return origin;
};
