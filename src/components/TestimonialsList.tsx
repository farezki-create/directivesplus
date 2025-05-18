
import React from 'react';
import { Star } from 'lucide-react';
import { TestimonialList } from '@/components/TestimonialList';
import { Testimonial } from '@/components/TestimonialList';

const TestimonialsList = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Marie Dupont',
      role: 'Utilisatrice',
      rating: 5,
      date: '2025-04-15',
      title: 'Une application qui change tout',
      content: 'DirectivesPlus m\'a permis de rédiger mes directives anticipées de façon claire et sereine. L\'interface est intuitive et le processus est bien expliqué.',
      itemType: 'general'
    },
    {
      id: '2',
      name: 'Thomas Martin',
      role: 'Professionnel de santé',
      rating: 4,
      date: '2025-03-22',
      title: 'Un outil précieux pour les professionnels',
      content: 'En tant que médecin, je recommande souvent DirectivesPlus à mes patients. Les directives sont claires, bien structurées et facilement accessibles en cas de besoin.',
      itemType: 'questionnaires'
    },
    {
      id: '3',
      name: 'Sophie Lefebvre',
      role: 'Aidante familiale',
      rating: 5,
      date: '2025-02-10',
      title: 'Simplicité et efficacité',
      content: 'J\'ai aidé ma mère à remplir ses directives anticipées. Le système de carte d\'accès est particulièrement bien pensé pour partager les informations avec le personnel soignant.',
      itemType: 'acces'
    }
  ];

  // Grouper les témoignages par catégorie
  const groupedTestimonials = {
    general: testimonials.filter(t => t.itemType === 'general') as Testimonial[],
    questionnaires: testimonials.filter(t => t.itemType === 'questionnaires') as Testimonial[],
    acces: testimonials.filter(t => t.itemType === 'acces') as Testimonial[],
    medical: testimonials.filter(t => t.itemType === 'medical') as Testimonial[]
  };

  return (
    <div>
      {/* Témoignages généraux */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-directiveplus-700 mb-6">
          Avis généraux sur DirectivesPlus
        </h2>
        <TestimonialList testimonials={groupedTestimonials.general} />
      </div>
      
      {/* Témoignages sur les questionnaires */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-directiveplus-700 mb-6">
          Avis sur les questionnaires
        </h2>
        <TestimonialList testimonials={groupedTestimonials.questionnaires} />
      </div>
      
      {/* Témoignages sur l'accès aux documents */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-directiveplus-700 mb-6">
          Avis sur la carte d'accès et le partage
        </h2>
        <TestimonialList testimonials={groupedTestimonials.acces} />
      </div>
      
      {/* Témoignages sur les données médicales */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-directiveplus-700 mb-6">
          Avis sur la gestion des données médicales
        </h2>
        <TestimonialList testimonials={groupedTestimonials.medical} />
      </div>
    </div>
  );
};

export default TestimonialsList;
