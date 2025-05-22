
// Utility file for document operations

/**
 * View a document in a new browser tab
 * @param documentUrl URL of the document to view
 */
export const viewDocument = (documentUrl: string) => {
  console.log("Opening document in new tab:", documentUrl);
  window.open(documentUrl, '_blank');
};

/**
 * Download a document
 * @param documentUrl URL of the document to download
 * @param fileName Optional file name for the downloaded document
 */
export const downloadDocument = (documentUrl: string, fileName?: string) => {
  console.log("Downloading document:", documentUrl);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = documentUrl;
  
  // Set the download attribute with file name if provided
  if (fileName) {
    link.download = fileName;
  } else {
    // Extract file name from URL as fallback
    const urlParts = documentUrl.split('/');
    link.download = urlParts[urlParts.length - 1];
  }
  
  // Append to body, trigger click and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Print a document
 * @param documentUrl URL of the document to print
 */
export const printDocument = (documentUrl: string) => {
  console.log("Printing document:", documentUrl);
  
  // Open document in a new window
  const printWindow = window.open(documentUrl, '_blank');
  
  // Wait for the document to load before printing
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  }
};

/**
 * Share a document
 * @param documentId ID of the document to share
 */
export const shareDocument = (documentId: string) => {
  console.log("Sharing document:", documentId);
  
  // Use Web Share API if available
  if (navigator.share) {
    navigator.share({
      title: 'Document partagé via DirectivesPlus',
      text: 'Veuillez consulter ce document partagé depuis DirectivesPlus.',
      url: window.location.origin + '/view-document/' + documentId,
    })
    .catch(error => console.log('Erreur lors du partage:', error));
  } else {
    // Fallback: Copy link to clipboard
    const shareUrl = window.location.origin + '/view-document/' + documentId;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Lien du document copié dans le presse-papiers!');
      })
      .catch(err => {
        console.error('Erreur lors de la copie du lien:', err);
      });
  }
};
