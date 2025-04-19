
import { BaseStorageProvider } from '@/utils/storage/providers/BaseStorageProvider';
import { ScalingoHDSConfig, DocumentMetadata } from './types';
import { ScalingoAccessControl } from './ScalingoAccessControl';

export class ScalingoStorageService extends BaseStorageProvider {
  private apiKey: string | undefined;
  private appId: string | undefined;
  private containerName: string;
  private region: string;

  constructor(config?: ScalingoHDSConfig) {
    super();
    this.apiKey = config?.apiKey;
    this.appId = config?.appId;
    this.containerName = config?.containerName || 'documents';
    this.region = config?.region || 'osc-fr1';
  }

  async uploadFile(fileData: string | Blob, fileName: string, metadata?: DocumentMetadata): Promise<string | null> {
    try {
      console.log(`[ScalingoStorageService] Uploading file ${fileName} to Scalingo HDS`);
      
      const blob = await this.convertToBlob(fileData);
      const accessId = ScalingoAccessControl.generateAccessId();
      
      // Simulate successful upload with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log(`[ScalingoStorageService] File uploaded successfully to ${this.containerName}/${fileName}`);
      console.log(`[ScalingoStorageService] Using Scalingo HDS region: ${this.region}`);
      console.log(`[ScalingoStorageService] Document access ID: ${accessId}`);
      
      return `${fileName.replace(".pdf", "")}_${accessId}`;
    } catch (error) {
      console.error("[ScalingoStorageService] Upload error:", error);
      return null;
    }
  }

  async retrieveFile(documentId: string): Promise<string | null> {
    try {
      console.log(`[ScalingoStorageService] Retrieving file with ID: ${documentId}`);
      
      // Simulate retrieval with delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock URL for demo purposes
      const mockUrl = `data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago...`;
      
      console.log(`[ScalingoStorageService] File retrieved successfully from region ${this.region}`);
      
      return mockUrl;
    } catch (error) {
      console.error("[ScalingoStorageService] Retrieval error:", error);
      return null;
    }
  }
}
