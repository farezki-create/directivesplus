
/**
 * Interface for standardized responses
 */
export interface StandardResponse {
  success: boolean;
  message?: string;
  details?: any;
  error?: string;
  deletionResults?: any[];
  timestamp?: string;
}

/**
 * Interface for deletion operation results
 */
export interface DeletionOperationResult {
  table: string;
  success: boolean;
  error?: string;
}
