
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
 * @param fileName Name to save the file as
 */
export const downloadDocument = (filePath: string) => {
  console.log("Downloading document:", filePath);
  
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = filePath;
  link.download = filePath.split('/').pop() || 'document';
  
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
 * @param filePath Path to the document
 * @param title Title for the share dialog
 */
export const shareDocument = (filePath: string, title = 'Partager ce document') => {
  console.log("Sharing document:", filePath);
  
  // Check if Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: title,
      url: filePath
    }).catch(err => {
      console.error("Error sharing:", err);
    });
  } else {
    // Fallback to copying the link
    navigator.clipboard.writeText(filePath).then(() => {
      console.log("Link copied to clipboard");
      // In a real app, show a toast notification here
    }).catch(err => {
      console.error("Error copying link:", err);
    });
  }
};
