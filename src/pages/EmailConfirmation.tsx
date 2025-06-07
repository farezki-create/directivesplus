
import React from 'react';
import { EmailConfirmationView } from '@/features/auth/components/EmailConfirmationView';
import { useEmailConfirmationFlow } from '@/features/auth/hooks/useEmailConfirmationFlow';

const EmailConfirmation = () => {
  const { isProcessingConfirmation } = useEmailConfirmationFlow();

  if (isProcessingConfirmation) {
    return <EmailConfirmationView />;
  }

  // Si pas de traitement en cours, rediriger vers auth
  return null;
};

export default EmailConfirmation;
