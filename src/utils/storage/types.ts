export interface CloudStorageProvider {
  uploadFile(fileData: string | Blob, fileName: string, metadata?: any): Promise<string | null>;
  retrieveFile(documentId: string): Promise<string | null>;
}

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
  scalingStrategy?: string;
  providers?: string[];
  providerConfigs?: CloudProviderConfig[];
  
  // Other parameters
  customConfig?: Record<string, any>;
}
