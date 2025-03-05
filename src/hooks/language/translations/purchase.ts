
import { Translation } from './types';

export const fr_purchase: Translation = {
  "buyCard": "Acheter la carte",
  "usbMemoryCard": "Carte mémoire USB format carte de crédit",
  "usbMemoryCardDescription": "Stockez vos directives anticipées sur une carte mémoire USB au format carte de crédit (non encore disponible).",
  "usbMemoryCardAlt": "Carte mémoire USB Directives Anticipées",
  "features": "Caractéristiques",
  "creditCardFormat": "Format carte de crédit - Se range facilement dans votre portefeuille",
  "usbConnector": "Connecteur USB intégré",
  "storageCapacity": "Capacité de stockage de 2 Go",
  "secureStorage": "Stockage sécurisé de vos directives anticipées",
  "universalCompatibility": "Compatibilité universelle",
  "usbMemoryCardNotAvailable": "Carte mémoire USB format carte de crédit (non encore disponible)",
  "productSoonAvailable": "Produit bientôt disponible",
  "productNotAvailableYet": "Ce produit n'est pas encore disponible à l'achat. Vous pouvez demander à être notifié lorsqu'il sera disponible.",
  "notificationRegistered": "Notification enregistrée",
  "notifyWhenAvailable": "Nous vous informerons dès que la carte sera disponible.",
  "notifyMe": "Me notifier quand disponible",
};

export const en_purchase: Translation = {
  "buyCard": "Buy Card",
  "usbMemoryCard": "Credit card format USB memory card",
  "usbMemoryCardDescription": "Store your advance directives on a credit card format USB memory card (not yet available).",
  "usbMemoryCardAlt": "Advance Directives USB Memory Card",
  "features": "Features",
  "creditCardFormat": "Credit card format - Fits easily in your wallet",
  "usbConnector": "Built-in USB connector",
  "storageCapacity": "2 GB storage capacity",
  "secureStorage": "Secure storage of your advance directives",
  "universalCompatibility": "Universal compatibility",
  "usbMemoryCardNotAvailable": "Credit card format USB memory card (not yet available)",
  "productSoonAvailable": "Product coming soon",
  "productNotAvailableYet": "This product is not yet available for purchase. You can request to be notified when it becomes available.",
  "notificationRegistered": "Notification registered",
  "notifyWhenAvailable": "We will notify you as soon as the card is available.",
  "notifyMe": "Notify me when available",
};

// Create an object that contains all translations
export const purchaseTranslations = {
  fr: fr_purchase,
  en: en_purchase
};
