
import { 
  CloudStorageFactory, 
  CloudProviderType, 
  ScalingStrategy,
  CloudProviderConfig 
} from "../CloudStorageFactory";
import { PDFGenerationService } from "@/utils/PDFGenerationService";

/**
 * Exemple de configuration et d'utilisation du fournisseur de stockage avec scaling
 */
export function configureScalingStorage() {
  // Configuration des fournisseurs individuels
  const awsConfig: CloudProviderConfig = {
    awsRegion: "eu-west-3",
    awsBucket: "mes-directives-anticipees",
    awsAccessKey: process.env.AWS_ACCESS_KEY,
    awsSecretKey: process.env.AWS_SECRET_KEY
  };
  
  const gcpConfig: CloudProviderConfig = {
    gcpProjectId: "directives-project",
    gcpBucket: "directives-bucket"
  };
  
  // Configuration du scaling
  const scalingConfig: CloudProviderConfig = {
    scalingStrategy: ScalingStrategy.ROUND_ROBIN,
    providers: [
      CloudProviderType.SUPABASE,
      CloudProviderType.AWS_S3,
      CloudProviderType.GOOGLE_CLOUD
    ],
    providerConfigs: [
      {},  // Configuration Supabase par défaut
      awsConfig,
      gcpConfig
    ]
  };
  
  // Création du fournisseur de stockage avec scaling
  const scalingProvider = CloudStorageFactory.createProvider(
    CloudProviderType.SCALING,
    scalingConfig
  );
  
  // Configuration du service de génération PDF pour utiliser le scaling
  PDFGenerationService.setStorageProvider(scalingProvider);
  
  console.log("Scaling storage provider configured successfully");
}

/**
 * Cette fonction permet de configurer une stratégie de scaling personnalisée
 */
export function configureCustomScaling(
  strategy: ScalingStrategy,
  providerTypes: CloudProviderType[],
  configs: CloudProviderConfig[]
) {
  const scalingConfig: CloudProviderConfig = {
    scalingStrategy: strategy,
    providers: providerTypes,
    providerConfigs: configs
  };
  
  const scalingProvider = CloudStorageFactory.createProvider(
    CloudProviderType.SCALING,
    scalingConfig
  );
  
  PDFGenerationService.setStorageProvider(scalingProvider);
  
  return scalingProvider;
}
