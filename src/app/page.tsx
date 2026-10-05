import Link from "next/link";
import { executeOperation } from "@/graphql/execute";
import type { CategoryData, ProductCardData } from "@/lib/types";
import { ProductCard } from "./product-card";

// Product data changes, so render on each request (also keeps `next build`
// from needing a database).
export const dynamic = "force-dynamic";

const HOME_QUERY = /* GraphQL */ `
  query Home($filter: ProductFilter) {
    categories {
      slug
      name
    }
    products(filter: $filter, take: 24) {
      slug
      name
      priceCents
      currency
      imageUrl
      inStock
    }
  }
`;

type HomeData = { categories: CategoryData[]; products: ProductCardData[] };

type SearchParam = string | string[] | undefined;

type Props = {
  searchParams: Promise<{ category?: SearchParam; q?: SearchParam }>;
};

// `?q=a&q=b` arrives as an array; only use the first value.
const first = (value: SearchParam) => (Array.isArray(value) ? value[0] : value);

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const category = first(params.category);
  const q = first(params.q);
  const data = await executeOperation<HomeData>(HOME_QUERY, {
    filter: { categorySlug: category, search: q },
  });

  return (
    <div className="space-y-6">
      <form className="flex gap-2" action="/">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products…"
          className="w-full rounded-md border border-stone-300 bg-transparent px-3 py-2 dark:border-stone-700"
        />
        <button className="rounded-md bg-stone-900 px-4 py-2 text-white dark:bg-stone-100 dark:text-stone-900">
          Search
        </button>
      </form>

      <ul className="flex flex-wrap gap-2 text-sm">
        <li>
          <CategoryLink href="/" active={!category}>
            All
          </CategoryLink>
        </li>
        {data.categories.map((c) => (
          <li key={c.slug}>
            <CategoryLink href={`/?category=${c.slug}`} active={category === c.slug}>
              {c.name}
            </CategoryLink>
          </li>
        ))}
      </ul>

      {data.products.length === 0 ? (
        <p className="text-stone-500">No products found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 ${
        active
          ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
          : "border-stone-300 dark:border-stone-700"
      }`}
    >
      {children}
    </Link>
  );
}
