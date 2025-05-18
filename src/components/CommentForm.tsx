
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface CommentFormValues {
  name: string;
  email: string;
  title: string;
  content: string;
  rating: string;
  itemType: string;
}

const CommentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormValues>({
    defaultValues: {
      name: '',
      email: '',
      title: '',
      content: '',
      rating: '5',
      itemType: 'general'
    }
  });

  const onSubmit = async (data: CommentFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Ici, on simule l'envoi du témoignage à la base de données
      // Dans une vraie implémentation, vous utiliseriez Supabase
      console.log('Commentaire soumis:', data);
      
      // Simuler un délai pour l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Commentaire envoyé",
        description: "Merci pour votre contribution !",
      });
      
      // Réinitialiser le formulaire
      reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du commentaire.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Votre nom</Label>
          <Input
            id="name"
            {...register('name', { required: "Le nom est requis" })}
            placeholder="Prénom Nom"
            className="mt-1"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="email">Votre email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { 
              required: "L'email est requis",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Adresse email invalide"
              }
            })}
            placeholder="exemple@email.com"
            className="mt-1"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
      </div>
      
      <div>
        <Label htmlFor="title">Titre de votre commentaire</Label>
        <Input
          id="title"
          {...register('title', { required: "Le titre est requis" })}
          placeholder="Ex: Une application qui m'a beaucoup aidé"
          className="mt-1"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>
      
      <div>
        <Label>Évaluation</Label>
        <div className="flex items-center space-x-2 mt-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                className="sr-only"
                value={value}
                {...register('rating')}
              />
              <Star 
                size={28} 
                className={`hover:text-yellow-500 ${Number(value) <= 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
              />
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <Label>Concerne</Label>
        <RadioGroup defaultValue="general" className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general" id="general" {...register('itemType')} />
            <Label htmlFor="general" className="cursor-pointer">Application en général</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="questionnaires" id="questionnaires" {...register('itemType')} />
            <Label htmlFor="questionnaires" className="cursor-pointer">Les questionnaires</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="acces" id="acces" {...register('itemType')} />
            <Label htmlFor="acces" className="cursor-pointer">Carte d'accès et partage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medical" id="medical" {...register('itemType')} />
            <Label htmlFor="medical" className="cursor-pointer">Données médicales</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="content">Votre commentaire</Label>
        <Textarea
          id="content"
          {...register('content', { 
            required: "Le contenu du commentaire est requis",
            minLength: {
              value: 20,
              message: "Votre commentaire doit contenir au moins 20 caractères"
            }
          })}
          placeholder="Partagez votre expérience avec DirectivesPlus..."
          className="mt-1 min-h-[120px]"
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
      </div>
      
      <Button 
        type="submit" 
        className="w-full md:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon commentaire'}
      </Button>
    </form>
  );
};

export default CommentForm;
