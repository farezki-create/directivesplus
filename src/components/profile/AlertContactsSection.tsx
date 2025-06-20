
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Phone, Mail, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAlertContacts } from '@/hooks/alerts/useAlertContacts';
import { useAuth } from '@/contexts/AuthContext';

const CONTACT_TYPE_LABELS: Record<string, string> = {
  'soignant': 'Soignant',
  'famille': 'Famille',
  'personne_confiance': 'Personne de confiance',
  'had': 'HAD',
  'soins_palliatifs': 'Soins palliatifs',
  'infirmiere': 'Infirmière',
  'medecin_traitant': 'Médecin traitant',
  'autre': 'Autre'
};

const AlertContactsSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alertContacts, loading } = useAlertContacts(user?.id);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contacts d'alerte
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/alert-contacts')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Gérer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alertContacts.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun contact d'alerte configuré</p>
            <p className="text-sm">Ajoutez des contacts pour recevoir des alertes automatiques</p>
            <Button 
              onClick={() => navigate('/alert-contacts')} 
              className="mt-4"
              variant="outline"
            >
              Configurer les contacts
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {alertContacts.slice(0, 3).map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{contact.contact_name}</h4>
                    <Badge variant="outline">
                      {CONTACT_TYPE_LABELS[contact.contact_type] || contact.contact_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {contact.phone_number && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {contact.phone_number}
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {alertContacts.length > 3 && (
              <div className="text-center text-sm text-gray-500">
                Et {alertContacts.length - 3} autres contacts...
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertContactsSection;
