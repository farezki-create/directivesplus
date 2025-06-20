
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileFooter from '@/components/profile/ProfileFooter';
import DeleteAccountSection from '@/components/profile/DeleteAccountSection';
import AlertContactsSection from '@/components/profile/AlertContactsSection';
import AppNavigation from '@/components/AppNavigation';
import Footer from '@/components/Footer';
import { useProfileData } from '@/components/profile/useProfileData';

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    profile, 
    isLoading, 
    setIsLoading, 
    formValues, 
    handleProfileUpdate 
  } = useProfileData();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/profile" } });
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProfileHeader />
          
          <div className="grid lg:grid-cols-1 gap-8">
            <div className="space-y-8">
              <ProfileForm 
                initialValues={formValues}
                profileId={profile.id}
                onProfileUpdate={handleProfileUpdate}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
              <AlertContactsSection />
              <DeleteAccountSection />
            </div>
          </div>
          
          <ProfileFooter />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
