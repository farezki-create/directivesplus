
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileFooter from "@/components/profile/ProfileFooter";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { useProfileData } from "@/components/profile/useProfileData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import BackButton from "@/components/ui/back-button";
import DeleteAccountSection from "@/components/profile/DeleteAccountSection";

export default function Profile() {
  const {
    profile,
    isLoading,
    setIsLoading,
    formValues,
    handleProfileUpdate,
    handleLogout
  } = useProfileData();

  return (
    <div className="container mx-auto py-10">
      <BackButton />
      <div className="space-y-6">
        <Card className={cn(
          "max-w-2xl mx-auto transition-all duration-300",
          isLoading ? "opacity-75" : "opacity-100"
        )}>
          {isLoading ? (
            <ProfileSkeleton />
          ) : (
            <>
              <CardHeader>
                <CardTitle>Votre profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProfileHeader 
                  firstName={profile?.first_name} 
                  lastName={profile?.last_name}
                  role={profile?.role} 
                />
                {!profile?.birth_date && (
                  <Alert className="bg-blue-50 border-blue-200 animate-fade-in">
                    <AlertDescription className="text-blue-800">
                      Complétez votre profil pour une meilleure prise en charge de vos demandes.
                    </AlertDescription>
                  </Alert>
                )}
                <ProfileForm 
                  initialValues={formValues} 
                  profileId={profile?.id || ''} 
                  onProfileUpdate={handleProfileUpdate}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
              <CardFooter className="flex justify-center">
                <ProfileFooter onLogout={handleLogout} />
              </CardFooter>
            </>
          )}
        </Card>
        
        {!isLoading && (
          <div className="max-w-2xl mx-auto mt-8">
            <DeleteAccountSection />
          </div>
        )}
      </div>
    </div>
  );
}
