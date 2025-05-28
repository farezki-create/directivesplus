
export const getPdfViewerUrl = (filePath: string) => {
  if (filePath.startsWith('data:')) {
    return filePath;
  }
  
  // Paramètres PDF pour affichage complet et navigation
  const pdfParams = new URLSearchParams({
    'toolbar': '1',
    'navpanes': '1',
    'scrollbar': '1',
    'view': 'FitV',
    'zoom': 'page-width',
    'pagemode': 'thumbs',
    'search': '',
    'nameddest': '',
    'page': '1'
  });
  
  return `${filePath}#${pdfParams.toString()}`;
};

export const getPdfUrlWithRetry = (filePath: string, retryCount: number) => {
  const baseUrl = getPdfViewerUrl(filePath);
  return retryCount > 0 ? `${baseUrl}&retry=${retryCount}` : baseUrl;
};
