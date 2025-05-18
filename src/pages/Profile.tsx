
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileFooter from "@/components/profile/ProfileFooter";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { useProfileData } from "@/components/profile/useProfileData";

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
      <Card className="max-w-2xl mx-auto">
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
    </div>
  );
}
