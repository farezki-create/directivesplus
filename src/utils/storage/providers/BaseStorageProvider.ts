
import { CloudStorageProvider } from '../types';

export abstract class BaseStorageProvider implements CloudStorageProvider {
  protected convertToBlob = async (fileData: string | Blob): Promise<Blob> => {
    if (typeof fileData === 'string') {
      const response = await fetch(fileData);
      return response.blob();
    }
    return fileData;
  };

  abstract uploadFile(fileData: string | Blob, fileName: string, metadata?: any): Promise<string | null>;
  abstract retrieveFile(documentId: string): Promise<string | null>;
}
