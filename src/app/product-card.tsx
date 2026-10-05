import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductCardData } from "@/lib/types";

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-stone-200 transition hover:shadow-md dark:border-stone-800"
    >
      <div className="relative aspect-square bg-stone-100 dark:bg-stone-900">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-2 p-4">
        <h2 className="font-medium">{product.name}</h2>
        <p className="whitespace-nowrap text-sm">
          {product.inStock ? (
            formatPrice(product.priceCents, product.currency)
          ) : (
            <span className="text-stone-500">Sold out</span>
          )}
        </p>
      </div>
    </Link>
  );
}
