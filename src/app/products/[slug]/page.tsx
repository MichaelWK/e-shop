import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { executeOperation } from "@/graphql/execute";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const PRODUCT_QUERY = /* GraphQL */ `
  query ProductPage($slug: String!) {
    product(slug: $slug) {
      name
      description
      priceCents
      currency
      imageUrl
      stock
      inStock
      category {
        slug
        name
      }
    }
  }
`;

type ProductPageData = {
  product: {
    name: string;
    description: string;
    priceCents: number;
    currency: string;
    imageUrl: string | null;
    stock: number;
    inStock: boolean;
    category: { slug: string; name: string };
  } | null;
};

type Props = { params: Promise<{ slug: string }> };

// cache() dedupes the query between generateMetadata and the page.
const getProduct = cache(async (slug: string) => {
  const data = await executeOperation<ProductPageData>(PRODUCT_QUERY, { slug });
  return data.product;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-900">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="space-y-4">
        <Link
          href={`/?category=${product.category.slug}`}
          className="text-sm text-stone-500 hover:underline"
        >
          {product.category.name}
        </Link>
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-2xl">{formatPrice(product.priceCents, product.currency)}</p>
        <p className="text-stone-600 dark:text-stone-400">{product.description}</p>
        <p className="text-sm">
          {product.inStock ? `${product.stock} in stock` : "Currently sold out"}
        </p>
        <button
          disabled={!product.inStock}
          className="rounded-md bg-stone-900 px-6 py-3 text-white disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900"
        >
          Add to cart
        </button>
        <p className="text-xs text-stone-500">Cart arrives in the next PR.</p>
      </div>
    </article>
  );
}
