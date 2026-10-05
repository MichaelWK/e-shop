import type { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import type { Resolvers } from "./__generated__/resolvers-types";

const MAX_TAKE = 50;

export const resolvers: Resolvers = {
  Query: {
    products: (_parent, { filter, take, skip }, { prisma }) => {
      const safeTake = Math.min(Math.max(take ?? 20, 1), MAX_TAKE);
      const safeSkip = Math.max(skip ?? 0, 0);
      const search = filter?.search?.trim();

      const where: Prisma.ProductWhereInput = {};
      if (filter?.categorySlug) where.category = { slug: filter.categorySlug };
      if (search) where.name = { contains: search, mode: "insensitive" };

      return prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: safeTake,
        skip: safeSkip,
      });
    },

    product: (_parent, { slug }, { prisma }) => prisma.product.findUnique({ where: { slug } }),

    categories: (_parent, _args, { prisma }) =>
      prisma.category.findMany({ orderBy: { name: "asc" } }),
  },

  Product: {
    inStock: (product) => product.stock > 0,

    // Prisma batches findUnique calls made in the same tick into one query,
    // so listing N products does not trigger N separate category lookups.
    category: async (product, _args, { prisma }) => {
      const category = await prisma.category.findUnique({ where: { id: product.categoryId } });
      if (!category) {
        throw new GraphQLError(`Category ${product.categoryId} not found`);
      }
      return category;
    },
  },

  Category: {
    products: (category, _args, { prisma }) =>
      prisma.product.findMany({ where: { categoryId: category.id }, orderBy: { name: "asc" } }),
  },
};
