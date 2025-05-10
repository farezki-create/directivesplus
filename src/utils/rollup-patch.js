
// This file prevents Rollup from trying to load native modules
// Forces the use of the JavaScript implementation instead

// Set environment variable to force JS implementation
process.env.ROLLUP_NATIVE_DISABLED = 'true';

// Monkey patch the module loader to prevent native module loading attempts
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id.includes('@rollup/rollup-linux') || id === '@rollup/native') {
    throw new Error('Native module loading disabled');
  }
  return originalRequire.apply(this, arguments);
};

console.log("✅ Rollup patch applied - forcing JavaScript implementation");
