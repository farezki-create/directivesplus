
import { useState } from "react";

interface RegistrationState {
  step: 'form' | 'confirmation' | 'success';
  userEmail: string;
  confirmationCode: string;
  firstName: string;
  lastName: string;
  userId?: string;
}

export const useRegistrationState = () => {
  const [registrationState, setRegistrationState] = useState<RegistrationState>({
    step: 'form',
    userEmail: '',
    confirmationCode: '',
    firstName: '',
    lastName: ''
  });

  const [confirmationError, setConfirmationError] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);

  const updateRegistrationState = (updates: Partial<RegistrationState>) => {
    setRegistrationState(prev => ({ ...prev, ...updates }));
  };

  const resetConfirmationError = () => setConfirmationError("");

  return {
    registrationState,
    confirmationError,
    isConfirming,
    updateRegistrationState,
    setConfirmationError,
    setIsConfirming,
    resetConfirmationError
  };
};
