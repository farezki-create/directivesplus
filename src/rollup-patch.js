// This file intentionally uses CommonJS to run before ES modules are processed
// Force set the environment variables
process.env.ROLLUP_DISABLE_NATIVE = 'true';
process.env.ROLLUP_NATIVE_DISABLED = 'true';
process.env.ROLLUP_NATIVE_DISABLE = 'true';
process.env.ROLLUP_FORCE_NODEJS = 'true';

// Add global flag 
global.__ROLLUP_NO_NATIVE__ = true;

// Monkey patch the module loading system to prevent loading native modules
const Module = require('module');
const originalRequire = Module.prototype.require;

// Keep track of what we've already patched
if (!global.__ROLLUP_PATCHED__) {
  // Patch the require function to intercept native module loads
  Module.prototype.require = function(path) {
    // Check if this is a Rollup native module and block it
    if (path && typeof path === 'string' && 
        (path.includes('@rollup/rollup-') || 
         path.includes('rollup/dist/native'))) {
      console.log(`[Rollup Patch] Preventing load of native module: ${path}`);
      
      // If trying to load the native.js file directly, return a mock module
      if (path.includes('rollup/dist/native')) {
        return {
          needsRebuilding: () => false,
          loadBindings: () => {
            throw new Error('Native bindings disabled by rollup-patch.js');
          },
          getDefaultNativeModuleName: () => null,
          getDefaultNativeModuleNames: () => [],
          getNativeModuleName: () => null
        };
      }
      
      // Otherwise throw an error to prevent loading
      throw new Error(`Native module loading disabled: ${path}`);
    }
    
    // Allow all other modules to load normally
    return originalRequire.apply(this, arguments);
  };

  console.log('[Rollup Patch] Successfully patched require() to prevent native Rollup modules');
  global.__ROLLUP_PATCHED__ = true;
}

// Export a dummy function to validate the patch is loaded
module.exports = {
  isPatched: () => global.__ROLLUP_PATCHED__ === true,
  getRollupSettings: () => ({
    nativeModulesDisabled: true,
    forceJavaScript: true
  })
};
