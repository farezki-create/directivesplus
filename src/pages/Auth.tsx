
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, EyeIcon, EyeOffIcon } from "lucide-react"; 
import Header from "@/components/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Helper function to clean up Supabase auth state
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

// Schema de validation pour le formulaire de connexion
const loginFormSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

// Schema de validation pour le formulaire d'inscription
const registerFormSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  birthDate: z.string().min(1, "Date de naissance requise"),
  email: z.string().email("Adresse email invalide"),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  passwordConfirm: z.string(),
}).refine(data => data.password === data.passwordConfirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirm"],
});

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  
  // Get the redirect path from location state or default to /dashboard instead of /rediger
  const from = location.state?.from || "/dashboard";

  // Formulaire de connexion avec React Hook Form
  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Formulaire d'inscription avec React Hook Form
  const registerForm = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      email: "",
      address: "",
      phoneNumber: "",
      password: "",
      passwordConfirm: "",
    },
  });

  // Redirect if already authenticated, but only after the auth state has loaded
  // and prevent redirect loops with a flag
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectInProgress) {
      console.log("Auth page: Already authenticated, redirecting to:", from);
      setRedirectInProgress(true);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from, redirectInProgress]);

  const handleSignIn = async (values: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    
    try {
      console.log("Attempting to sign in...");
      
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Try to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if this fails
      }
      
      // Now sign in
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
      
      console.log("Sign in successful, redirecting to:", from);
      // Use replace: true to prevent back button from going to login again
      setRedirectInProgress(true);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Handle specific error cases
      if (error.message.includes("Email not confirmed")) {
        toast({
          title: "Email non vérifié",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
          variant: "destructive",
        });
        setVerificationEmail(values.email);
        setVerificationSent(true);
      } else {
        toast({
          title: "Erreur de connexion",
          description: error.message || "Une erreur est survenue lors de la connexion.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (values: z.infer<typeof registerFormSchema>) => {
    setLoading(true);
    
    try {
      console.log("Attempting to sign up...");
      
      // Clean up existing auth state first
      cleanupAuthState();
      
      // Try to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if this fails
      }
      
      // Format birthdate properly
      const birthDate = new Date(values.birthDate).toISOString().split('T')[0];
      
      // Now sign up
      const { error, data } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            birth_date: birthDate,
            address: values.address || null,
            phone_number: values.phoneNumber || null,
          },
          emailRedirectTo: window.location.origin + "/auth"
        }
      });

      if (error) throw error;
      
      // Check if email confirmation is required
      if (data?.user?.identities && data.user.identities.length === 0) {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà associé à un compte. Essayez de vous connecter.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
        setVerificationEmail(values.email);
        setVerificationSent(true);
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: verificationEmail || registerForm.getValues("email"),
      });
      
      if (error) throw error;
      
      toast({
        title: "Email envoyé",
        description: "Un nouvel email de vérification a été envoyé.",
      });
    } catch (error: any) {
      console.error("Email resend error:", error);
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Une erreur est survenue lors de l'envoi de l'email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Don't render auth page if already authenticated and redirecting
  if (isAuthenticated && redirectInProgress) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
        <p className="ml-3">Redirection en cours...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="grid min-h-screen place-items-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Authentification</CardTitle>
            <CardDescription>Connectez-vous ou créez un compte pour accéder à vos directives.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {verificationSent && (
              <Alert className="bg-amber-50 border-amber-200 mb-4">
                <AlertDescription className="text-amber-800">
                  <p>Un email de vérification a été envoyé à <strong>{verificationEmail}</strong>.</p>
                  <p className="mt-2">Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2" 
                    onClick={resendVerificationEmail}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Renvoyer l'email
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button disabled={loading} type="submit" className="w-full">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {loading ? "Connexion..." : "Se connecter"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom*</FormLabel>
                            <FormControl>
                              <Input placeholder="Prénom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom*</FormLabel>
                            <FormControl>
                              <Input placeholder="Nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={registerForm.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance*</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email*</FormLabel>
                          <FormControl>
                            <Input placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
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

                    <FormField
                      control={registerForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 1 23 45 67 89" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
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
                          <FormMessage />
                          <p className="text-xs text-gray-500 mt-1">
                            Au moins 8 caractères, une majuscule et un chiffre
                          </p>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
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
                    
                    <Button disabled={loading} type="submit" className="w-full">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {loading ? "Inscription..." : "S'inscrire"}
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      * Champs obligatoires
                    </p>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500 text-center w-full">
              En vous inscrivant, vous acceptez de recevoir un email de vérification.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Auth;
