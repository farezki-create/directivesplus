
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, UserPlus } from 'lucide-react';

interface AlertContactFormProps {
  onSave: (contact: {
    contact_type: string;
    contact_name: string;
    phone_number?: string;
    email?: string;
    is_active: boolean;
  }) => Promise<boolean>;
}

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

const AlertContactForm: React.FC<AlertContactFormProps> = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
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

    const success = await onSave({
      ...formData,
      phone_number: formData.phone_number || undefined,
      email: formData.email || undefined,
      is_active: true
    });

    if (success) {
      setFormData({
        contact_type: '',
        contact_name: '',
        phone_number: '',
        email: ''
      });
      setIsOpen(false);
    }

    setSaving(false);
  };

  const isValid = formData.contact_type && formData.contact_name && 
                  (formData.phone_number || formData.email);

  if (!isOpen) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Button onClick={() => setIsOpen(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un contact d'alerte
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Nouveau contact d'alerte
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              onClick={() => setIsOpen(false)}
              disabled={saving}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AlertContactForm;
