import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ForgotPassword } from "@/components/ForgotPassword";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Définition des préfixes téléphoniques par pays
const COUNTRY_PREFIXES = {
  "France": "+33",
  "Belgique": "+32",
  "Suisse": "+41",
  "Luxembourg": "+352",
  "Canada": "+1",
  "Monaco": "+377",
} as const;

type CountryKey = keyof typeof COUNTRY_PREFIXES;

// Schéma de base pour l'email et le mot de passe
const baseSchema = {
  email: z.string().email("Email invalide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
};

// Schéma pour la connexion (sans confirmation de mot de passe)
const loginSchema = z.object(baseSchema);

// Schéma pour l'inscription (avec informations personnelles)
const signUpSchema = z.object({
  ...baseSchema,
  confirmPassword: z.string(),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  country: z.string().min(1, "Le pays est requis"),
  phoneNumber: z.string().min(9, "Le numéro de téléphone doit contenir au moins 9 chiffres"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  postalCode: z.string().min(5, "Le code postal doit contenir au moins 5 caractères"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type FormValues = z.infer<typeof signUpSchema>;

type AuthFormProps = {
  isSignUp: boolean;
  onSubmit: (values: FormValues) => void;
  onToggleMode: () => void;
};

export const AuthForm = ({ isSignUp, onSubmit, onToggleMode }: AuthFormProps) => {
  const schema = isSignUp ? signUpSchema : loginSchema;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      country: "France",
      phoneNumber: "",
      address: "",
      city: "",
      postalCode: "",
    },
  });

  console.log('Form mode:', isSignUp ? 'signup' : 'login');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Votre adresse email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mot de passe
                {isSignUp && " (8 caractères min., 1 majuscule, 1 chiffre)"}
              </FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder={isSignUp ? "Choisissez un mot de passe fort" : "Votre mot de passe"} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSignUp && (
          <>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Retapez votre mot de passe" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} />
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
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
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
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre adresse" {...field} />
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
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input placeholder="Code postal" {...field} />
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
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Ville" {...field} />
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
                    <FormLabel>Pays</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre pays" />
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
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <div className="flex gap-2">
                      <Select 
                        defaultValue={COUNTRY_PREFIXES[form.getValues("country") as CountryKey]} 
                        disabled
                      >
                        <FormControl>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue>
                              {COUNTRY_PREFIXES[form.getValues("country") as CountryKey]}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem 
                            value={COUNTRY_PREFIXES[form.getValues("country") as CountryKey]}
                          >
                            {COUNTRY_PREFIXES[form.getValues("country") as CountryKey]}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        className="flex-1"
                        placeholder="Votre numéro de téléphone" 
                        {...field} 
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        <Button type="submit" className="w-full">
          {isSignUp ? "S'inscrire" : "Se connecter"}
        </Button>

        {!isSignUp && <ForgotPassword email={form.getValues("email")} />}

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isSignUp ? (
            <>
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:underline"
              >
                Connectez-vous
              </button>
            </>
          ) : (
            <>
              Vous n'avez pas de compte ?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:underline"
              >
                Inscrivez-vous
              </button>
            </>
          )}
        </p>
      </form>
    </Form>
  );
};