
// This file is maintained for backwards compatibility
// It re-exports everything from the refactored modules
import { useAccessCode, generateRandomCode } from "./access-codes/useAccessCode";
import { generateAccessCode } from "./access-codes/generateCode";

// Re-export everything for backwards compatibility
export { useAccessCode, generateRandomCode, generateAccessCode };

// Default export for easy importing
export default useAccessCode;
