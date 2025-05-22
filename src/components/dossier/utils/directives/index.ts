
import { logDirectiveDebugInfo } from './directiveLogger';
import { extractDirectives } from './directiveExtractor';

// Export extractors for potential direct usage
import { extractDirectivesByPath } from './extractors/coreExtractor';
import { extractDirectivesFromString } from './extractors/stringParser';
import { searchDirectivesRecursively } from './extractors/recursiveSearch';
import { createDirectivesMirror } from './extractors/mirrorCreator';

export {
  logDirectiveDebugInfo,
  extractDirectives,
  // Export individual extractors
  extractDirectivesByPath,
  extractDirectivesFromString,
  searchDirectivesRecursively,
  createDirectivesMirror
};
