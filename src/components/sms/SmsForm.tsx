
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useBrevoSms } from '@/hooks/useBrevoSms';
import { Loader2, MessageSquare } from 'lucide-react';

export const SmsForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('DirectivesPlus');
  const { sendSms, isSending } = useBrevoSms();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim() || !message.trim()) {
      return;
    }

    await sendSms({
      to: phoneNumber,
      message,
      sender
    });

    // Réinitialiser le formulaire après envoi réussi
    setPhoneNumber('');
    setMessage('');
  };

  const formatPhoneNumber = (value: string) => {
    // Supprimer tous les caractères non numériques
    const cleaned = value.replace(/\D/g, '');
    // Formater avec des espaces pour la lisibilité
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const remainingChars = 160 - message.length;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Envoyer un SMS
        </CardTitle>
        <CardDescription>
          Envoyez des SMS via Brevo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="06 12 34 56 78"
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={14}
              required
            />
            <p className="text-xs text-gray-500">
              Format: numéro français (06, 07, etc.)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender">Expéditeur (optionnel)</Label>
            <Input
              id="sender"
              type="text"
              placeholder="DirectivesPlus"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              maxLength={11}
            />
            <p className="text-xs text-gray-500">
              Maximum 11 caractères
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={160}
              rows={4}
              required
            />
            <p className="text-xs text-gray-500">
              {remainingChars} caractères restants
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSending || !phoneNumber.trim() || !message.trim()}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              'Envoyer le SMS'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
