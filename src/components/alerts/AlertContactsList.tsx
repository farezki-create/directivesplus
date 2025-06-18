
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Phone, Mail, Users } from 'lucide-react';
import { AlertContact } from '@/hooks/useAlertContacts';

interface AlertContactsListProps {
  contacts: AlertContact[];
  onDelete: (id: string) => Promise<boolean>;
}

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

const AlertContactsList: React.FC<AlertContactsListProps> = ({ contacts, onDelete }) => {
  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun contact d'alerte configuré</p>
            <p className="text-sm">Ajoutez des contacts pour recevoir des alertes automatiques</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Contacts d'alerte ({contacts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map(contact => (
            <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(contact.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertContactsList;
