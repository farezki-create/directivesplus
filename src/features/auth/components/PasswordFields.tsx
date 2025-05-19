
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const PasswordFields = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mot de passe*</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  {...field} 
                  aria-label="Mot de passe"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-directiveplus-500 rounded-full p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
            <FormDescription className="text-xs text-gray-500 mt-1">
              Au moins 8 caractères, une majuscule et un chiffre
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="passwordConfirm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe*</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  {...field} 
                  aria-label="Confirmer le mot de passe"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-directiveplus-500 rounded-full p-1"
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
    </>
  );
};
