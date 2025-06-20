
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, UserPlus, Phone, Mail, Users, Trash2 } from 'lucide-react';
import { useProfileAlertSettings } from '@/hooks/alerts/useProfileAlertSettings';

const CONTACT_TYPES = [
  { value: 'soignant', label: 'Soignant' },
  { value: 'famille', label: 'Membre de la famille' },
  { value: 'personne_confiance', label: 'Personne de confiance' },
  { value: 'had', label: 'HAD (Hospitalisation à domicile)' },
  { value: 'soins_palliatifs', label: 'Unité mobile de soins palliatifs' },
  { value: 'infirmiere', label: 'Infirmière' },
  { value: 'medecin_traitant', label: 'Médecin traitant' },
  { value: 'autre', label: 'Autre' }
];

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
  const { contacts, saveContact, deleteContact, loading } = useProfileAlertSettings();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [formData, setFormData] = useState({
    contact_type: '',
    contact_name: '',
    phone_number: '',
    email: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const success = await saveContact({
      contact_type: formData.contact_type,
      contact_name: formData.contact_name,
      phone_number: formData.phone_number || undefined,
      email: formData.email || undefined
    });

    if (success) {
      setFormData({
        contact_type: '',
        contact_name: '',
        phone_number: '',
        email: ''
      });
      setIsAddingContact(false);
    }

    setSaving(false);
  };

  const isValid = formData.contact_type && formData.contact_name && 
                  (formData.phone_number || formData.email);

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
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Contacts d'alerte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAddingContact && (
          <Button 
            onClick={() => setIsAddingContact(true)} 
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un contact d'alerte
          </Button>
        )}

        {isAddingContact && (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="h-5 w-5" />
              <h4 className="font-medium">Nouveau contact d'alerte</h4>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="contact_type">Type de contact</Label>
                <Select 
                  value={formData.contact_type} 
                  onValueChange={(value) => setFormData({...formData, contact_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type de contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contact_name">Nom du contact</Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                  placeholder="Dr. Martin, Marie Dupont..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone_number">Numéro de téléphone</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contact@exemple.fr"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={!isValid || saving}
                  className="flex-1"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddingContact(false)}
                  disabled={saving}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {contacts.length === 0 && !isAddingContact ? (
          <div className="text-center text-gray-500 py-4">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun contact d'alerte configuré</p>
            <p className="text-sm">Ajoutez des contacts pour recevoir des alertes automatiques</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map(contact => (
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteContact(contact.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertContactsSection;
