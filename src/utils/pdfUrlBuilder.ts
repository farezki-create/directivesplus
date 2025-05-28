
export const getPdfViewerUrl = (filePath: string) => {
  if (filePath.startsWith('data:')) {
    return filePath;
  }
  
  // Pour éviter les blocages de Chrome, on utilise des paramètres plus simples
  const pdfParams = new URLSearchParams({
    'view': 'FitH',
    'zoom': 'page-fit'
  });
  
  return `${filePath}#${pdfParams.toString()}`;
};

export const getPdfUrlWithRetry = (filePath: string, retryCount: number) => {
  if (filePath.startsWith('data:')) {
    return filePath;
  }
  
  // Différentes stratégies selon le nombre de tentatives
  if (retryCount === 0) {
    // Première tentative : paramètres normaux
    return getPdfViewerUrl(filePath);
  } else if (retryCount === 1) {
    // Deuxième tentative : sans paramètres
    return filePath;
  } else {
    // Tentatives suivantes : forcer le téléchargement
    const url = new URL(filePath, window.location.origin);
    url.searchParams.set('download', 'true');
    url.searchParams.set('retry', retryCount.toString());
    return url.toString();
  }
};

// Fonction pour détecter si Chrome bloque les PDF
export const detectChromeBlocking = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isChrome = userAgent.includes('chrome') && !userAgent.includes('edg');
  
  // Vérifier les paramètres de Chrome pour les PDF
  if (isChrome) {
    try {
      // Tentative de détection des paramètres de blocage
      return localStorage.getItem('chrome-pdf-blocked') === 'true';
    } catch {
      return false;
    }
  }
  
  return false;
};
