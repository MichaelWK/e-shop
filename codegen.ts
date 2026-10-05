import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * Generates TypeScript types for every resolver from the GraphQL schema,
 * so a resolver that returns the wrong shape fails `npm run typecheck`.
 * Runs automatically on `npm install` (postinstall) — re-run with
 * `npm run codegen` after editing src/graphql/typeDefs.ts.
 */
const config: CodegenConfig = {
  schema: "src/graphql/typeDefs.ts",
  generates: {
    "src/graphql/__generated__/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../context#GraphQLContext",
        // Resolvers receive Prisma models as parents, not GraphQL types.
        mappers: {
          Product: "@prisma/client#Product as ProductModel",
          Category: "@prisma/client#Category as CategoryModel",
        },
        useIndexSignature: true,
        useTypeImports: true,
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
