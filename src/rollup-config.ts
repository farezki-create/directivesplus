
// Force set the global flag IMMEDIATELY to disable native modules 
// Don't wait for function calls
(globalThis as any).__ROLLUP_NO_NATIVE__ = true;

// Make sure we also set process.env for environments that use it
if (typeof process !== 'undefined' && process.env) {
  process.env.ROLLUP_NATIVE_DISABLE = 'true';
}

export const ensureJavaScriptRollup = () => {
  // Double-check the setting and force it if not already set
  if (!(globalThis as any).__ROLLUP_NO_NATIVE__) {
    console.warn('Warning: Rollup native modules were not properly disabled');
    (globalThis as any).__ROLLUP_NO_NATIVE__ = true;
  }
  
  if (typeof process !== 'undefined' && process.env) {
    process.env.ROLLUP_NATIVE_DISABLE = 'true';
  }
  
  // Log confirmation that the setting was applied
  console.log('Rollup JavaScript implementation flag set:', { 
    rollupNoNative: (globalThis as any).__ROLLUP_NO_NATIVE__,
    usingJSImplementation: (globalThis as any).__ROLLUP_NO_NATIVE__ === true,
    envVariable: typeof process !== 'undefined' ? process.env.ROLLUP_NATIVE_DISABLE : 'unavailable'
  });
  
  return true;
};

// Run the check immediately
ensureJavaScriptRollup();

// Export confirmation that the setting was applied
export default true;
