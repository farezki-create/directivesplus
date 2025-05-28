
export const getPdfViewerUrl = (filePath: string) => {
  if (filePath.startsWith('data:')) {
    return filePath;
  }
  
  // Simplification des paramètres pour éviter les blocages
  const pdfParams = new URLSearchParams({
    'view': 'FitH',
    'zoom': 'page-fit',
    'toolbar': '1',
    'navpanes': '1'
  });
  
  return `${filePath}#${pdfParams.toString()}`;
};

export const getPdfUrlWithRetry = (filePath: string, retryCount: number) => {
  if (filePath.startsWith('data:')) {
    return filePath;
  }
  
  // Stratégies progressives selon le nombre de tentatives
  if (retryCount === 0) {
    // Première tentative : paramètres optimisés
    return getPdfViewerUrl(filePath);
  } else if (retryCount === 1) {
    // Deuxième tentative : paramètres minimaux
    return `${filePath}#view=FitH`;
  } else if (retryCount === 2) {
    // Troisième tentative : sans paramètres
    return filePath;
  } else {
    // Tentatives suivantes : forcer le téléchargement
    const url = new URL(filePath, window.location.origin);
    url.searchParams.set('download', 'true');
    url.searchParams.set('retry', retryCount.toString());
    url.searchParams.set('force', 'true');
    return url.toString();
  }
};

// Fonction pour détecter si le navigateur bloque les PDF
export const detectChromeBlocking = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isChrome = userAgent.includes('chrome') && !userAgent.includes('edg');
  const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
  const isFirefox = userAgent.includes('firefox');
  
  // Vérifier les paramètres de blocage connus
  if (isChrome) {
    try {
      return localStorage.getItem('chrome-pdf-blocked') === 'true';
    } catch {
      return false;
    }
  }
  
  // Safari et Firefox ont leurs propres comportements
  if (isSafari || isFirefox) {
    return false; // Généralement moins de problèmes
  }
  
  return false;
};

// Fonction pour obtenir l'URL optimisée selon le navigateur
export const getBrowserOptimizedUrl = (filePath: string, userAgent?: string) => {
  const ua = userAgent || navigator.userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    // Mobile : URL simple sans paramètres
    return filePath;
  }
  
  if (ua.includes('chrome')) {
    // Chrome : paramètres conservateurs
    return `${filePath}#view=FitH&zoom=page-fit`;
  }
  
  if (ua.includes('firefox')) {
    // Firefox : paramètres standards
    return `${filePath}#view=FitH&zoom=page-width`;
  }
  
  if (ua.includes('safari')) {
    // Safari : paramètres minimaux
    return `${filePath}#view=FitH`;
  }
  
  // Défaut : paramètres de base
  return getPdfViewerUrl(filePath);
};
