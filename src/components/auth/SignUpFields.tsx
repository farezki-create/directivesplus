
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import { COUNTRY_PREFIXES } from "./constants";
import { useLanguage } from "@/hooks/useLanguage";

type SignUpFieldsProps = {
  form: UseFormReturn<FormValues>;
};

export const SignUpFields = ({ form }: SignUpFieldsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('confirmPassword')} *</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder={t('retypePassword')} 
                {...field} 
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('firstName')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('yourFirstName')} {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('lastName')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('yourLastName')} {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('birthDate')} *</FormLabel>
            <FormControl>
              <Input type="date" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('address')} *</FormLabel>
            <FormControl>
              <Input placeholder={t('yourAddress')} {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('postalCode')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('yourPostalCode')} {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('city')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('yourCity')} {...field} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('country')} *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} required>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCountry')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(COUNTRY_PREFIXES).map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('phoneNumber')}</FormLabel>
            <div className="flex gap-2">
              <Select 
                defaultValue={COUNTRY_PREFIXES[form.getValues("country") as keyof typeof COUNTRY_PREFIXES]} 
                disabled
              >
                <FormControl>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue>
                      {COUNTRY_PREFIXES[form.getValues("country") as keyof typeof COUNTRY_PREFIXES]}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem 
                    value={COUNTRY_PREFIXES[form.getValues("country") as keyof typeof COUNTRY_PREFIXES]}
                  >
                    {COUNTRY_PREFIXES[form.getValues("country") as keyof typeof COUNTRY_PREFIXES]}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input 
                className="flex-1"
                placeholder={t('yourPhoneNumber')} 
                {...field} 
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <p className="text-xs text-muted-foreground">
        * Champs obligatoires
      </p>
    </div>
  );
};
