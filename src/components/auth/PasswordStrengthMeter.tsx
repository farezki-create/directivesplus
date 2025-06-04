
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const calculateStrength = (pwd: string) => {
    let score = 0;
    const checks = {
      length: pwd.length >= 12,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      noCommon: !/(password|123456|qwerty|abc123)/i.test(pwd)
    };

    Object.values(checks).forEach(check => check && score++);
    return { score, checks };
  };

  const { score, checks } = calculateStrength(password);
  const percentage = (score / 6) * 100;

  const getStrengthText = () => {
    if (score <= 2) return 'Très faible';
    if (score <= 3) return 'Faible';
    if (score <= 4) return 'Moyen';
    if (score <= 5) return 'Fort';
    return 'Très fort';
  };

  const getStrengthColor = () => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-orange-500';
    if (score <= 4) return 'bg-yellow-500';
    if (score <= 5) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (!password) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Force du mot de passe</span>
          <span className={`font-medium ${score >= 4 ? 'text-green-600' : 'text-red-600'}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center gap-1 ${checks.length ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.length ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          Au moins 12 caractères
        </div>
        <div className={`flex items-center gap-1 ${checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.lowercase ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          Lettres minuscules
        </div>
        <div className={`flex items-center gap-1 ${checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.uppercase ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          Lettres majuscules
        </div>
        <div className={`flex items-center gap-1 ${checks.numbers ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.numbers ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          Chiffres
        </div>
        <div className={`flex items-center gap-1 ${checks.special ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.special ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          Caractères spéciaux
        </div>
        <div className={`flex items-center gap-1 ${checks.noCommon ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.noCommon ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          Pas trop commun
        </div>
      </div>
    </div>
  );
};
