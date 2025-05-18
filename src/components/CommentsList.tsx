
import React from 'react';
import { Star } from 'lucide-react';
import { CommentList } from '@/components/CommentList';
import { Comment } from '@/components/CommentList';

const CommentsList = () => {
  const comments: Comment[] = [
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

  // Grouper les commentaires par catégorie
  const groupedComments = {
    general: comments.filter(t => t.itemType === 'general') as Comment[],
    questionnaires: comments.filter(t => t.itemType === 'questionnaires') as Comment[],
    acces: comments.filter(t => t.itemType === 'acces') as Comment[],
    medical: comments.filter(t => t.itemType === 'medical') as Comment[]
  };

  return (
    <div>
      {/* Avis généraux */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-directiveplus-700 mb-6">
          Avis généraux sur DirectivesPlus
        </h2>
        <CommentList comments={groupedComments.general} />
      </div>
      
      {/* Avis sur les questionnaires */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-directiveplus-700 mb-6">
          Avis sur les questionnaires
        </h2>
        <CommentList comments={groupedComments.questionnaires} />
      </div>
      
      {/* Avis sur l'accès aux documents */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-directiveplus-700 mb-6">
          Avis sur la carte d'accès et le partage
        </h2>
        <CommentList comments={groupedComments.acces} />
      </div>
      
      {/* Avis sur les données médicales */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-directiveplus-700 mb-6">
          Avis sur la gestion des données médicales
        </h2>
        <CommentList comments={groupedComments.medical} />
      </div>
    </div>
  );
};

export default CommentsList;
