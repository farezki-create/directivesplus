
export interface ScalingoHDSConfig {
  apiKey?: string;
  appId?: string;
  containerName?: string;
  region?: string;
}

export interface DocumentMetadata {
  userId?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  documentType?: string;
  createdAt: string;
  accessId?: string;
}

export interface UserVerification {
  firstName: string;
  lastName: string;
  birthDate: string;
}
