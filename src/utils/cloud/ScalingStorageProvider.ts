
import { CloudStorageProvider } from "@/utils/PDFGenerationService";
import { ScalingStrategy } from "./CloudStorageFactory";

/**
 * Implémentation d'un fournisseur de stockage cloud qui distribue les fichiers
 * entre plusieurs fournisseurs selon une stratégie de scaling définie
 */
export class ScalingStorageProvider implements CloudStorageProvider {
  private providers: CloudStorageProvider[];
  private strategy: ScalingStrategy;
  private currentIndex: number = 0;
  
  /**
   * Crée une nouvelle instance du fournisseur de stockage avec scaling
   * @param providers - Les fournisseurs de stockage sous-jacents
   * @param strategy - La stratégie de scaling à utiliser
   */
  constructor(providers: CloudStorageProvider[], strategy: ScalingStrategy) {
    if (!providers.length) {
      throw new Error("At least one storage provider is required for scaling");
    }
    
    this.providers = providers;
    this.strategy = strategy;
  }
  
  /**
   * Télécharge un fichier vers le stockage cloud en utilisant la stratégie de scaling
   * @param fileData - Le contenu du fichier en format base64 ou blob
   * @param fileName - Le nom du fichier
   * @param metadata - Métadonnées associées au fichier
   * @returns L'identifiant unique du document stocké
   */
  async uploadFile(fileData: string | Blob, fileName: string, metadata?: any): Promise<string | null> {
    try {
      console.log(`[ScalingStorageProvider] Uploading file using ${this.strategy} strategy`);
      
      // Sélectionner un fournisseur selon la stratégie
      const selectedProvider = this.selectProvider(fileData);
      
      // Déléguer le téléchargement au fournisseur sélectionné
      const documentId = await selectedProvider.uploadFile(fileData, fileName, metadata);
      
      if (documentId) {
        // Stocker l'association entre documentId et le fournisseur pour les récupérations futures
        // Dans une implémentation réelle, cela serait stocké dans une base de données
        console.log(`[ScalingStorageProvider] File uploaded with ID: ${documentId}`);
      }
      
      return documentId;
    } catch (error) {
      console.error("[ScalingStorageProvider] Upload error:", error);
      return null;
    }
  }
  
  /**
   * Récupère un fichier depuis le stockage cloud
   * @param documentId - L'identifiant unique du document
   * @returns L'URL ou le contenu du fichier récupéré
   */
  async retrieveFile(documentId: string): Promise<string | null> {
    try {
      console.log(`[ScalingStorageProvider] Retrieving file: ${documentId}`);
      
      // Dans une implémentation réelle, nous consulterions une base de données pour savoir
      // quel fournisseur contient ce document. Ici, nous essayons tous les fournisseurs.
      
      let result: string | null = null;
      
      // Essayer tous les fournisseurs jusqu'à ce que l'un d'eux trouve le document
      for (const provider of this.providers) {
        try {
          const fileUrl = await provider.retrieveFile(documentId);
          if (fileUrl) {
            result = fileUrl;
            break;
          }
        } catch (err) {
          // Continuer avec le fournisseur suivant
          console.log(`[ScalingStorageProvider] Provider failed to retrieve, trying next one`);
        }
      }
      
      if (!result) {
        console.error(`[ScalingStorageProvider] File not found in any provider: ${documentId}`);
      }
      
      return result;
    } catch (error) {
      console.error("[ScalingStorageProvider] Retrieval error:", error);
      return null;
    }
  }
  
  /**
   * Sélectionne un fournisseur de stockage selon la stratégie de scaling définie
   * @param fileData - Le contenu du fichier (utilisé pour certaines stratégies)
   * @returns Le fournisseur sélectionné
   */
  private selectProvider(fileData: string | Blob): CloudStorageProvider {
    switch (this.strategy) {
      case ScalingStrategy.ROUND_ROBIN:
        // Sélectionner les fournisseurs à tour de rôle
        const provider = this.providers[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.providers.length;
        return provider;
        
      case ScalingStrategy.FILE_SIZE:
        // Sélectionner selon la taille du fichier
        const size = fileData instanceof Blob ? fileData.size : fileData.length;
        // Pour cet exemple, utiliser le module de la taille par le nombre de fournisseurs
        return this.providers[size % this.providers.length];
        
      case ScalingStrategy.RANDOM:
        // Sélectionner aléatoirement
        const randomIndex = Math.floor(Math.random() * this.providers.length);
        return this.providers[randomIndex];
        
      case ScalingStrategy.AVAILABILITY:
        // Dans une implémentation réelle, nous vérifierions la disponibilité de chaque fournisseur
        // Pour cet exemple, nous utilisons simplement round-robin
        const defaultProvider = this.providers[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.providers.length;
        return defaultProvider;
        
      default:
        // Par défaut, utiliser le premier fournisseur
        return this.providers[0];
    }
  }
}
