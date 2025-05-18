
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/contexts/AuthContext";

// Profile schema avec validation
const profileSchema = z.object({
  firstName: z.string().min(2, "Prénom requis (2 caractères minimum)"),
  lastName: z.string().min(2, "Nom requis (2 caractères minimum)"),
  email: z.string().email("Email invalide").optional(),
  birthDate: z.date().optional(),
  phoneNumber: z.string()
    .regex(/^[0-9+\s-]{6,15}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string()
    .regex(/^[0-9]{5}$/, "Code postal invalide (5 chiffres)")
    .optional()
    .or(z.literal('')),
  country: z.string().optional(),
});

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string; // We'll get this from auth
  birth_date: Date | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  role: "patient" | "medecin" | "institution"; // We'll get this from auth context
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, session } = useAuth();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: undefined,
      phoneNumber: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          toast.error("Session expirée", {
            description: "Veuillez vous reconnecter",
          });
          navigate("/auth");
          return;
        }

        // Get the user's profile
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          toast.error("Erreur lors du chargement du profil", {
            description: error.message,
          });
          return;
        }

        if (data) {
          // Combine data with user email and role
          const userRole = user.user_metadata?.role || "patient";
          const enrichedProfile = {
            ...data,
            email: user.email || "",
            role: userRole as "patient" | "medecin" | "institution"
          };
          
          setProfile(enrichedProfile as Profile);
          
          // Transform the date string to a Date object if it exists
          const birthDate = data.birth_date ? new Date(data.birth_date) : undefined;
          
          form.reset({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            email: user.email || "",
            birthDate: birthDate,
            phoneNumber: data.phone_number || "",
            address: data.address || "",
            city: data.city || "",
            postalCode: data.postal_code || "",
            country: data.country || "",
          });
        }
      } catch (error: any) {
        toast.error("Une erreur est survenue", {
          description: error.message || "Veuillez réessayer plus tard",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, form]);

  // Update profile
  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      setIsLoading(true);

      if (!profile) return;
      
      // Format the birthDate for the database if it exists
      const formattedBirthDate = values.birthDate ? values.birthDate.toISOString().split('T')[0] : null;

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          birth_date: formattedBirthDate,
          phone_number: values.phoneNumber,
          address: values.address,
          city: values.city,
          postal_code: values.postalCode,
          country: values.country,
        })
        .eq("id", profile.id);

      if (error) {
        toast.error("Erreur lors de la mise à jour du profil", {
          description: error.message,
        });
        return;
      }

      toast.success("Profil mis à jour avec succès");
      
      // Update local state
      setProfile({
        ...profile,
        first_name: values.firstName,
        last_name: values.lastName,
        birth_date: values.birthDate,
        phone_number: values.phoneNumber,
        address: values.address,
        city: values.city,
        postal_code: values.postalCode,
        country: values.country,
      });
    } catch (error: any) {
      toast.error("Une erreur est survenue", {
        description: error.message || "Veuillez réessayer plus tard",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle logout
  async function handleLogout() {
    try {
      // Clean up auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      toast.success("Déconnexion réussie");
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  }

  const roleLabel = {
    patient: "Patient / Personne physique",
    medecin: "Médecin / Professionnel de santé",
    institution: "Institution / Établissement de santé",
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-20 rounded-full mx-auto" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Votre profil</CardTitle>
          <CardDescription>
            Gérez vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20">
              <AvatarFallback>
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-directiveplus-600 font-medium">{roleLabel[profile?.role || "patient"]}</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
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
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" disabled {...field} />
                    </FormControl>
                    <FormDescription>
                      L'adresse email ne peut pas être modifiée
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de naissance</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                    <FormControl>
                      <Input placeholder="Téléphone" {...field} />
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
                      <Input placeholder="Adresse" {...field} />
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
                    <FormControl>
                      <Input placeholder="Pays" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
                  disabled={isLoading}
                >
                  Mettre à jour le profil
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            className="w-full text-red-500 border-red-300 hover:bg-red-50"
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
