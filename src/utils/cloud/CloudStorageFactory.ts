
import { CloudStorageProvider } from "@/utils/PDFGenerationService";
import { SupabaseStorageProvider } from "@/utils/PDFGenerationService";
import { AWSStorageProvider } from "./AWSStorageProvider";
import { GoogleCloudStorageProvider } from "./GoogleCloudStorageProvider";
import { AzureStorageProvider } from "./AzureStorageProvider";

/**
 * Types de fournisseurs de stockage cloud supportés
 */
export enum CloudProviderType {
  SUPABASE = 'supabase',
  AWS_S3 = 'aws_s3',
  GOOGLE_CLOUD = 'google_cloud',
  AZURE_BLOB = 'azure_blob',
  CUSTOM = 'custom'
}

/**
 * Configuration pour les différents fournisseurs de stockage cloud
 */
export interface CloudProviderConfig {
  // AWS S3
  awsRegion?: string;
  awsBucket?: string;
  awsAccessKey?: string;
  awsSecretKey?: string;
  
  // Google Cloud Storage
  gcpProjectId?: string;
  gcpBucket?: string;
  
  // Azure Blob Storage
  azureAccountName?: string;
  azureContainer?: string;
  azureConnectionString?: string;
  
  // Autres paramètres communs
  customConfig?: Record<string, any>;
}

/**
 * Factory pour créer et configurer des fournisseurs de stockage cloud
 */
export class CloudStorageFactory {
  /**
   * Crée un fournisseur de stockage cloud basé sur le type et la configuration
   * @param type - Le type de fournisseur de stockage cloud
   * @param config - La configuration pour le fournisseur
   * @returns Une instance du fournisseur de stockage cloud
   */
  static createProvider(
    type: CloudProviderType,
    config: CloudProviderConfig = {}
  ): CloudStorageProvider {
    switch (type) {
      case CloudProviderType.SUPABASE:
        return new SupabaseStorageProvider();
        
      case CloudProviderType.AWS_S3:
        if (!config.awsRegion || !config.awsBucket) {
          throw new Error("AWS S3 configuration incomplete: region and bucket required");
        }
        return new AWSStorageProvider(
          config.awsRegion,
          config.awsBucket,
          config.awsAccessKey,
          config.awsSecretKey
        );
        
      case CloudProviderType.GOOGLE_CLOUD:
        if (!config.gcpProjectId || !config.gcpBucket) {
          throw new Error("Google Cloud Storage configuration incomplete: projectId and bucket required");
        }
        return new GoogleCloudStorageProvider(
          config.gcpProjectId,
          config.gcpBucket
        );
        
      case CloudProviderType.AZURE_BLOB:
        if (!config.azureAccountName || !config.azureContainer) {
          throw new Error("Azure Blob Storage configuration incomplete: accountName and container required");
        }
        return new AzureStorageProvider(
          config.azureAccountName,
          config.azureContainer,
          config.azureConnectionString
        );
        
      case CloudProviderType.CUSTOM:
        throw new Error("Custom cloud provider must be implemented and provided directly");
        
      default:
        // Si le type n'est pas reconnu, utiliser Supabase par défaut
        console.warn(`Cloud provider type '${type}' not recognized. Using Supabase as fallback.`);
        return new SupabaseStorageProvider();
    }
  }
}
