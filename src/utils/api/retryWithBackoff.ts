
/**
 * Utility for retrying API calls with exponential backoff
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  onRetry?: (currentRetry: number) => void
): Promise<T> => {
  let currentRetry = 0;
  
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const attempt = async (): Promise<T> => {
    try {
      return await operation();
    } catch (err) {
      if (currentRetry >= maxRetries) {
        throw err;
      }
      
      const backoffTime = Math.min(Math.pow(2, currentRetry) * 1000, 10000);
      
      if (onRetry) {
        onRetry(currentRetry);
      }
      
      currentRetry++;
      await wait(backoffTime);
      return attempt();
    }
  };
  
  return attempt();
};
