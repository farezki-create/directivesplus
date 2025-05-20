
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppNavigation from "@/components/AppNavigation";
import SynthesisContent from "@/components/synthesis/SynthesisContent";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const Synthesis = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/synthese" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get user metadata from auth
        const userMetadata = user.user_metadata || {};
        
        // Create a basic profile from user metadata
        const basicProfile = {
          id: user.id,
          first_name: userMetadata.first_name || "",
          last_name: userMetadata.last_name || "",
          email: user.email || "",
          birth_date: userMetadata.birth_date || null,
          phone_number: userMetadata.phone_number || "",
          address: userMetadata.address || "",
          city: userMetadata.city || "",
          postal_code: userMetadata.postal_code || ""
        };
        
        // Try to get additional profile data from profiles table
        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id);
          
          if (!profileError && profile && profile.length > 0) {
            // Merge profile data with basic profile (profile data takes precedence)
            setProfileData({ ...basicProfile, ...profile[0] });
          } else {
            // Just use the basic profile from metadata
            setProfileData(basicProfile);
          }
        } catch (profileErr) {
          console.warn("Could not fetch profile table data, using metadata only:", profileErr);
          setProfileData(basicProfile);
        }
      } catch (error: any) {
        console.error("Error loading profile:", error.message);
        setError("Impossible de charger les données de votre profil");
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de votre profil",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);

  // Show loading indicator for both auth and profile data
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="space-y-8 max-w-4xl mx-auto">
            <Skeleton className="h-10 w-2/3 mx-auto" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </main>
        
        <footer className="bg-white py-6 border-t mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Display error state if there was an error
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppNavigation />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md max-w-xl mx-auto mt-8">
            <h2 className="text-xl font-semibold mb-2">Erreur</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </main>
        
        <footer className="bg-white py-6 border-t mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Important: Only render page content if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <SynthesisContent profileData={profileData} userId={user?.id} />
      </main>
      
      <footer className="bg-white py-6 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 DirectivesPlus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Synthesis;
