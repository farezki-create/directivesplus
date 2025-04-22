
import { CloudStorageProvider } from "@/utils/storage/types";
import { SupabaseStorageProvider } from "@/utils/storage/providers/SupabaseProvider";
import { AWSStorageProvider } from "./AWSStorageProvider";
import { GoogleCloudStorageProvider } from "./GoogleCloudStorageProvider";
import { AzureStorageProvider } from "./AzureStorageProvider";
import { ScalingStorageProvider } from "./ScalingStorageProvider";
import { ScalingoHDSStorageProvider } from "./ScalingoHDSStorageProvider";

/**
 * Types de fournisseurs de stockage cloud supportés
 */
export enum CloudProviderType {
  SUPABASE = 'supabase',
  AWS_S3 = 'aws_s3',
  GOOGLE_CLOUD = 'google_cloud',
  AZURE_BLOB = 'azure_blob',
  SCALING = 'scaling',
  SCALINGO_HDS = 'scalingo_hds',
  CUSTOM = 'custom'
}

/**
 * Stratégies de scaling pour la répartition des fichiers
 */
export enum ScalingStrategy {
  ROUND_ROBIN = 'round_robin',
  FILE_SIZE = 'file_size',
  RANDOM = 'random',
  AVAILABILITY = 'availability'
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
  
  // Scalingo HDS
  scalingoApiKey?: string;
  scalingoAppId?: string;
  scalingoContainer?: string;
  scalingoRegion?: string;
  
  // Scaling
  scalingStrategy?: ScalingStrategy;
  providers?: CloudProviderType[];
  providerConfigs?: CloudProviderConfig[];
  
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
      
      case CloudProviderType.SCALINGO_HDS:
        // Pour Scalingo HDS, nous permettons une configuration minimale
        return new ScalingoHDSStorageProvider(
          config.scalingoApiKey,
          config.scalingoAppId,
          config.scalingoContainer || 'documents',
          config.scalingoRegion || 'osc-fr1'
        );

      case CloudProviderType.SCALING:
        if (!config.providers || config.providers.length === 0) {
          throw new Error("Scaling configuration incomplete: at least one provider is required");
        }
        
        // Créer les fournisseurs sous-jacents
        const providers: CloudStorageProvider[] = [];
        for (let i = 0; i < config.providers.length; i++) {
          const providerType = config.providers[i];
          const providerConfig = config.providerConfigs?.[i] || {};
          
          // Éviter une récursion infinie
          if (providerType === CloudProviderType.SCALING) {
            throw new Error("Cannot nest scaling providers");
          }
          
          providers.push(this.createProvider(providerType, providerConfig));
        }
        
        return new ScalingStorageProvider(
          providers,
          config.scalingStrategy || ScalingStrategy.ROUND_ROBIN
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
