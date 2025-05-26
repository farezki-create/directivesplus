
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { PasswordValidationResult } from "@/utils/security/passwordSecurity";

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidationResult;
  className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  validation, 
  className = "" 
}) => {
  const getStrengthColor = (strength: PasswordValidationResult['strength']) => {
    switch (strength) {
      case 'very-weak': return 'bg-red-500';
      case 'weak': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-blue-500';
      case 'very-strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthText = (strength: PasswordValidationResult['strength']) => {
    switch (strength) {
      case 'very-weak': return 'Très faible';
      case 'weak': return 'Faible';
      case 'medium': return 'Moyen';
      case 'strong': return 'Fort';
      case 'very-strong': return 'Très fort';
      default: return 'Indéterminé';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Force du mot de passe
          </span>
          <span className={`text-sm font-medium ${
            validation.score >= 70 ? 'text-green-600' : 
            validation.score >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {getStrengthText(validation.strength)}
          </span>
        </div>
        <Progress 
          value={validation.score} 
          className="h-2"
        />
        <div className={`h-2 rounded-full ${getStrengthColor(validation.strength)} transition-all duration-300`} 
             style={{ width: `${validation.score}%` }} />
      </div>

      {/* Messages d'erreur */}
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-red-600">
              <XCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Messages d'avertissement */}
      {validation.warnings.length > 0 && (
        <div className="space-y-1">
          {validation.warnings.map((warning, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-yellow-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Validation réussie */}
      {validation.isValid && validation.score >= 70 && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>Mot de passe sécurisé !</span>
        </div>
      )}

      {/* Conseils de sécurité */}
      {validation.score < 70 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Conseils pour un mot de passe sécurisé :
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Au moins 12 caractères</li>
            <li>• Mélangez majuscules, minuscules, chiffres et symboles</li>
            <li>• Évitez les mots courants et les informations personnelles</li>
            <li>• Utilisez une phrase secrète avec des substitutions</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
