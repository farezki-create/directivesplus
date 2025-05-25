
export interface DonationLevel {
  amount: string;
  description: string;
  impact: string;
}

export interface DonationAmounts {
  oneTime: string[];
  recurring: string[];
}

export interface DonationConfig {
  currency: string;
  currencySymbol: string;
  defaultAmounts: DonationAmounts;
  suggestedLevels: DonationLevel[];
  productNames: {
    oneTime: string;
    recurring: string;
  };
  descriptions: {
    oneTime: string;
    recurring: string;
  };
  successUrls: {
    oneTime: string;
    recurring: string;
  };
  fundUsage: {
    development: { percentage: number; title: string; description: string };
    infrastructure: { percentage: number; title: string; description: string };
    communication: { percentage: number; title: string; description: string };
  };
}

export const donationConfig: DonationConfig = {
  currency: 'eur',
  currencySymbol: '€',
  defaultAmounts: {
    oneTime: ["10", "20", "50", "100"],
    recurring: ["5", "10", "15", "25"]
  },
  suggestedLevels: [
    {
      amount: "25€",
      description: "Aide à couvrir les frais d'hébergement pour un mois",
      impact: "Assure la disponibilité de la plateforme"
    },
    {
      amount: "50€",
      description: "Contribue au développement de nouvelles fonctionnalités",
      impact: "Améliore l'expérience utilisateur"
    },
    {
      amount: "100€",
      description: "Soutient la maintenance et la sécurité de la plateforme",
      impact: "Garantit la protection des données"
    },
    {
      amount: "250€",
      description: "Finance les certifications et audits de sécurité",
      impact: "Renforce la confiance des utilisateurs"
    }
  ],
  productNames: {
    oneTime: "Don à DirectivePlus",
    recurring: "Don mensuel à DirectivePlus"
  },
  descriptions: {
    oneTime: "Contribution pour soutenir le développement de DirectivePlus",
    recurring: "Contribution mensuelle pour soutenir DirectivePlus"
  },
  successUrls: {
    oneTime: "/soutenir?success=true",
    recurring: "/soutenir?success=true&type=subscription"
  },
  fundUsage: {
    development: {
      percentage: 60,
      title: "Développement",
      description: "Amélioration continue de la plateforme et nouvelles fonctionnalités"
    },
    infrastructure: {
      percentage: 25,
      title: "Infrastructure",
      description: "Hébergement sécurisé, maintenance et support technique"
    },
    communication: {
      percentage: 15,
      title: "Communication",
      description: "Promotion, documentation et support utilisateur"
    }
  }
};
