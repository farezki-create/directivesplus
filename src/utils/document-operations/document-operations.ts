
// Utility functions for document operations

/**
 * View a document by setting it as preview or opening it in a new window
 * @param filePath Path to the document
 * @param fileType MIME type of the document
 * @param setPreviewDocument Optional function to set preview document
 */
export const viewDocument = (filePath: string) => {
  console.log("Opening document for viewing:", filePath);
  window.open(filePath, '_blank');
};

/**
 * Download a document
 * @param filePath Path to the document
 * @param fileName Name to save the file as (optional, will be extracted from path if not provided)
 */
export const downloadDocument = (filePath: string) => {
  console.log("Downloading document:", filePath);
  
  // Extract filename from path if not provided
  const fileName = filePath.split('/').pop() || 'document';
  
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = filePath;
  link.download = fileName;
  
  // Append to the document, trigger click and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Print a document
 * @param filePath Path to the document
 */
export const printDocument = (filePath: string) => {
  console.log("Printing document:", filePath);
  
  // Open the document in a new window and print it
  const printWindow = window.open(filePath, '_blank');
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  }
};

/**
 * Share a document via the Web Share API or fallback to copying the link
 * @param documentId Document ID for sharing
 * @param title Title for the share dialog
 */
export const shareDocument = (documentId: string, title = 'Partager ce document') => {
  console.log("Sharing document:", documentId);
  
  // Create a shareable link (you may need to adjust this based on your app structure)
  const shareUrl = `${window.location.origin}/document/${documentId}`;
  
  // Check if Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: title,
      url: shareUrl
    }).catch(err => {
      console.error("Error sharing:", err);
    });
  } else {
    // Fallback to copying the link
    navigator.clipboard.writeText(shareUrl).then(() => {
      console.log("Link copied to clipboard");
      // In a real app, show a toast notification here
    }).catch(err => {
      console.error("Error copying link:", err);
    });
  }
};
