
import React, { useState, useCallback } from 'react';
import { InputSanitizer } from '@/utils/security/inputSanitization';
import { SecureErrorHandler } from '@/utils/security/errorHandling';
import { useSecurity } from './SecurityProvider';

interface SecureFormProps {
  children: React.ReactNode;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  rateLimitKey?: string;
  maxAttempts?: number;
  className?: string;
}

export const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSubmit,
  rateLimitKey,
  maxAttempts = 5,
  className
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkRateLimit, validateSession } = useSecurity();

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Validate session
    if (!validateSession()) {
      setError('Session expirée. Veuillez vous reconnecter.');
      return;
    }

    // Check rate limiting
    if (rateLimitKey && !checkRateLimit(rateLimitKey, maxAttempts, 15 * 60 * 1000)) {
      setError('Trop de tentatives. Veuillez patienter avant de réessayer.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const sanitizedData: Record<string, string> = {};

      // Sanitize all form inputs
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          sanitizedData[key] = InputSanitizer.sanitizeField(value, key);
        }
      }

      await onSubmit(sanitizedData);
    } catch (err: any) {
      // Fix: Await the promise before setting error
      const userMessage = await SecureErrorHandler.sanitizeErrorForUser(err);
      setError(userMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, rateLimitKey, maxAttempts, checkRateLimit, validateSession]);

  return (
    <form 
      onSubmit={handleSubmit}
      className={`secure-form ${className || ''}`}
      autoComplete="off"
      noValidate
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {children}
      
      {isSubmitting && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
    </form>
  );
};
