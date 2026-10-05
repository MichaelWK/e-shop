// Shapes returned by the queries in src/app. Kept in sync with the selection sets by hand
// for now — a good follow-up PR is the GraphQL Codegen "client preset" to generate these.

export type ProductCardData = {
  slug: string;
  name: string;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  inStock: boolean;
};

export type CategoryData = {
  slug: string;
  name: string;
};
