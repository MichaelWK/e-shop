import { graphql } from "graphql";
import { describe, expect, it, vi } from "vitest";
import type { GraphQLContext } from "../context";
import { schema } from "../schema";

// Resolver tests run against the real schema with a mocked Prisma client,
// so they need no database and run in milliseconds.
function createMockContext() {
  const prisma = {
    product: { findMany: vi.fn(), findUnique: vi.fn() },
    category: { findMany: vi.fn(), findUnique: vi.fn() },
  };
  return { prisma, contextValue: { prisma } as unknown as GraphQLContext };
}

const productRow = {
  id: "p1",
  slug: "desk-mat",
  name: "Desk Mat",
  description: "A mat",
  priceCents: 8900,
  currency: "PLN",
  imageUrl: null,
  stock: 0,
  categoryId: "c1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Query.products", () => {
  it("passes filters to Prisma and caps page size at 50", async () => {
    const { prisma, contextValue } = createMockContext();
    prisma.product.findMany.mockResolvedValue([]);

    const result = await graphql({
      schema,
      contextValue,
      source: /* GraphQL */ `
        {
          products(filter: { categorySlug: "audio", search: " mic " }, take: 500) {
            id
          }
        }
      `,
    });

    expect(result.errors).toBeUndefined();
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          category: { slug: "audio" },
          name: { contains: "mic", mode: "insensitive" },
        },
        take: 50,
        skip: 0,
      }),
    );
  });

  it("derives inStock from stock and resolves the category", async () => {
    const { prisma, contextValue } = createMockContext();
    prisma.product.findMany.mockResolvedValue([productRow]);
    prisma.category.findUnique.mockResolvedValue({
      id: "c1",
      slug: "accessories",
      name: "Accessories",
    });

    const result = await graphql({
      schema,
      contextValue,
      source: "{ products { slug inStock category { slug } } }",
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({
      products: [{ slug: "desk-mat", inStock: false, category: { slug: "accessories" } }],
    });
  });
});

describe("Query.product", () => {
  it("returns null for an unknown slug", async () => {
    const { prisma, contextValue } = createMockContext();
    prisma.product.findUnique.mockResolvedValue(null);

    const result = await graphql({
      schema,
      contextValue,
      source: '{ product(slug: "nope") { id } }',
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual({ product: null });
  });
});
