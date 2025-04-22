
/**
 * Cleans up cached response data from local storage
 */
export const cleanupCacheData = (): void => {
  try {
    const cacheKeys = Object.keys(localStorage).filter(key => 
      key.includes('response') || 
      key.includes('directive') || 
      key.includes('synthesis') ||
      key.includes('profile')
    );
    
    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed cached data: ${key}`);
    });
  } catch (e) {
    console.error('Error during cache cleanup:', e);
  }
};
