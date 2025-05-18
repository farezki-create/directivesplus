
/**
 * Detects the file type based on the file path or extension
 */
export const detectFileType = (filePath: string): string => {
  if (!filePath) return "application/pdf"; // Default
  
  if (filePath.includes('image') || 
      filePath.endsWith('.jpg') || 
      filePath.endsWith('.jpeg') || 
      filePath.endsWith('.png') || 
      filePath.endsWith('.gif')) {
    return 'image/jpeg';
  } else if (filePath.includes('pdf') || filePath.endsWith('.pdf')) {
    return 'application/pdf';
  } else if (filePath.includes('audio') || 
             filePath.endsWith('.mp3') || 
             filePath.endsWith('.wav')) {
    return 'audio/mpeg';
  }
  return 'application/pdf'; // Default
};
