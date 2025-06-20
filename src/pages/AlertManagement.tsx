
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell } from 'lucide-react';
import { useProfileAlertContacts } from '@/hooks/useProfileAlertContacts';
import AlertContactForm from '@/components/alerts/AlertContactForm';
import AlertContactsList from '@/components/alerts/AlertContactsList';
import AlertSettings from '@/components/alerts/AlertSettings';
import AppNavigation from '@/components/AppNavigation';
import Footer from '@/components/Footer';

const AlertManagement = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const {
    contacts,
    settings,
    loading,
    saveContact,
    deleteContact,
    saveSettings
  } = useProfileAlertContacts();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/alert-management" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Transformer les données pour la compatibilité avec les composants existants
  const transformedSettings = settings ? {
    id: 'profile-settings',
    patient_id: user?.id || '',
    auto_alert_enabled: settings.auto_alert_enabled,
    alert_threshold: settings.alert_threshold,
    symptom_types: settings.symptom_types,
    sms_enabled: settings.sms_enabled,
    sms_provider: settings.sms_provider,
    phone_number: settings.phone_number,
    whatsapp_number: settings.whatsapp_number,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } : null;

  const transformedContacts = contacts.map(contact => ({
    id: contact.id,
    patient_id: user?.id || '',
    contact_type: contact.contact_type as any,
    contact_name: contact.contact_name,
    phone_number: contact.phone_number,
    email: contact.email,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <Bell className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
              Gestion des alertes
            </h1>
            <p className="text-gray-600 text-lg">
              Configurez vos contacts d'alerte et les paramètres d'alerte automatique pour vos symptômes
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <AlertContactForm onSave={saveContact} />
              <AlertContactsList 
                contacts={transformedContacts} 
                onDelete={deleteContact} 
              />
            </div>
            
            <div>
              <AlertSettings 
                settings={transformedSettings} 
                onSave={saveSettings} 
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AlertManagement;
