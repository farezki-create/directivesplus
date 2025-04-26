
import { CloudStorageProvider } from '@/utils/storage/types';
import { ScalingoStorageService } from './scalingo/ScalingoStorageService';
import { ScalingoAccessControl } from './scalingo/ScalingoAccessControl';
import { UserVerification } from './scalingo/types';

export class ScalingoHDSStorageProvider implements CloudStorageProvider {
  private storageService: ScalingoStorageService;

  constructor(
    apiKey?: string,
    appId?: string,
    containerName: string = 'documents',
    region: string = 'osc-fr1'
  ) {
    this.storageService = new ScalingoStorageService({
      apiKey,
      appId,
      containerName,
      region
    });
  }

  async uploadFile(fileData: string | Blob, fileName: string, metadata?: any): Promise<string | null> {
    return this.storageService.uploadFile(fileData, fileName, metadata);
  }

  async retrieveFile(documentId: string): Promise<string | null> {
    return this.storageService.retrieveFile(documentId);
  }

  async verifyAccessByCode(accessId: string, userInfo: UserVerification): Promise<string | null> {
    return ScalingoAccessControl.verifyAccess(accessId, userInfo);
  }
}
