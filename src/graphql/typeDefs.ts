// The single source of truth for the API shape.
// After editing, run `npm run codegen` to refresh resolver types.
export const typeDefs = /* GraphQL */ `
  type Query {
    "List products, optionally filtered. 'take' is capped at 50."
    products(filter: ProductFilter, take: Int = 20, skip: Int = 0): [Product!]!
    product(slug: String!): Product
    categories: [Category!]!
  }

  input ProductFilter {
    categorySlug: String
    "Case-insensitive match on the product name."
    search: String
  }

  type Product {
    id: ID!
    slug: String!
    name: String!
    description: String!
    "Price in minor units (e.g. grosze). 4999 = 49.99."
    priceCents: Int!
    currency: String!
    imageUrl: String
    stock: Int!
    inStock: Boolean!
    category: Category!
  }

  type Category {
    id: ID!
    slug: String!
    name: String!
    products: [Product!]!
  }
`;
