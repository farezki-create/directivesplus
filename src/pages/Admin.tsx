
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Define a type for what Supabase actually returns from the profiles table
type SupabaseProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  address: string | null;
  birth_date: string | null;
  city: string | null;
  country: string | null;
  medical_access_code: string | null;
  phone_number: string | null;
  postal_code: string | null;
}

// Our app's user profile type with additional fields we need
type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  // Fields missing from Supabase but needed in our interface
  email: string; // We'll populate this from auth context
  role: "patient" | "medecin" | "institution"; // We'll get this from auth context
  email_verified: boolean; // We'll determine this with helper function
  terms_accepted: boolean; // We'll assume false if not present
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (!isLoading && isAuthenticated && profile?.role !== "institution") {
      toast.error("Accès non autorisé", {
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      });
      navigate("/");
      return;
    }
  }, [profile, isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // Get profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (profilesError) {
          toast.error("Erreur lors du chargement des utilisateurs", {
            description: profilesError.message,
          });
          return;
        }

        // Get auth users to get emails and supplement data
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error("Error fetching auth users:", authError);
        }

        // Map profiles with auth data
        // Specify the type for profilesData as SupabaseProfile[]
        const typedProfilesData = profilesData as SupabaseProfile[];
        const enrichedUsers: UserProfile[] = typedProfilesData.map(profile => {
          // Find matching auth user
          const authUser = authData?.users?.find(user => user.id === profile.id);
          
          return {
            id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            created_at: profile.created_at,
            email: authUser?.email || "Email inconnu",
            // Since role might not be in the profile, provide a default
            role: (authUser?.user_metadata?.role as "patient" | "medecin" | "institution") || "patient",
            email_verified: authUser?.email_confirmed_at !== null || false,
            terms_accepted: false // Default value as terms_accepted might not exist yet in profiles
          };
        });

        setUsers(enrichedUsers);
      } catch (error: any) {
        toast.error("Une erreur est survenue", {
          description: error.message || "Veuillez réessayer plus tard",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && profile?.role === "institution") {
      fetchUsers();
    }
  }, [isAuthenticated, profile]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "patient":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Patient</Badge>;
      case "medecin":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Médecin</Badge>;
      case "institution":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Institution</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-directiveplus-600" />
        </div>
      </div>
    );
  }

  // Only allow institutions to see this page
  if (profile.role !== "institution") {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Vue d'ensemble de tous les utilisateurs inscrits sur la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Email vérifié</TableHead>
                <TableHead>CGU acceptées</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.email_verified ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Oui
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Non
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.terms_accepted ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Oui
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Non
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-directiveplus-600 border-directiveplus-200 hover:bg-directiveplus-50"
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
