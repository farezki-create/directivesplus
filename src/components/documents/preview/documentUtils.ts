
export const detectDocumentType = (filePath: string) => {
  const fileName = filePath.toLowerCase();
  
  // Check if it's a directive by checking if filePath is just a UUID (directive ID)
  const isDirective = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(filePath);
  
  const isAudio = fileName.includes('audio') || 
                  fileName.endsWith('.mp3') || 
                  fileName.endsWith('.wav') || 
                  fileName.endsWith('.ogg');
  
  const isPdf = fileName.includes('pdf') || 
                fileName.endsWith('.pdf') || 
                fileName.includes('application/pdf') ||
                fileName.startsWith('data:application/pdf');
  
  const isImage = fileName.includes('image') || 
                  fileName.endsWith('.jpg') || 
                  fileName.endsWith('.jpeg') || 
                  fileName.endsWith('.png') || 
                  fileName.endsWith('.gif') || 
                  fileName.includes('image/jpeg') || 
                  fileName.includes('image/png') ||
                  fileName.startsWith('data:image/');

  return {
    isAudio,
    isPdf,
    isImage,
    isDirective
  };
};
