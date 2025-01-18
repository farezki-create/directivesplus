export type TrustedPerson = {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
  address: string;
  city: string;
  postalCode: string;
};

export type NewTrustedPerson = Omit<TrustedPerson, "id">;