
import React, { useState } from "react";
import { Control, FieldPath } from "react-hook-form";
import { EyeIcon, EyeOffIcon, RefreshCw } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordStrengthIndicator from "@/components/ui/password-strength-indicator";
import { validatePasswordSecurity, generateSecurePassword } from "@/utils/security/passwordSecurity";

interface PasswordFieldsProps {
  form: {
    control: Control<any>;
    setValue: (name: string, value: string) => void;
    watch: (name: string) => string;
  };
}

export const PasswordFields = ({ form }: PasswordFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const password = form.watch("password") || "";
  const passwordValidation = validatePasswordSecurity(password);

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword(16);
    form.setValue("password", newPassword);
    form.setValue("passwordConfirm", newPassword);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Mot de passe</FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGeneratePassword}
                className="text-xs h-auto p-1"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Générer
              </Button>
            </div>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  {...field}
                  className={`pr-10 ${
                    password && !passwordValidation.isValid ? 'border-red-500' : 
                    password && passwordValidation.score >= 70 ? 'border-green-500' : ''
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </FormControl>
            
            {/* Indicateur de force du mot de passe */}
            {password && (
              <PasswordStrengthIndicator 
                validation={passwordValidation} 
                className="mt-2"
              />
            )}
            
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="passwordConfirm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  {...field} 
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
