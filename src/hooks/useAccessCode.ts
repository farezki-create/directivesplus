
// This file is maintained for backwards compatibility
// It re-exports everything from the refactored modules
import { useAccessCode, generateRandomCode } from "./access-codes/useAccessCode";
import { generateAccessCode } from "./access-codes/generateCode";

export { useAccessCode, generateRandomCode, generateAccessCode };

export default useAccessCode;
