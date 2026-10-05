import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GraphQL Shop", template: "%s · GraphQL Shop" },
  description: "E-commerce demo built with Next.js, GraphQL and Prisma.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-stone-200 dark:border-stone-800">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold">
              GraphQL Shop
            </Link>
            {process.env.NODE_ENV !== "production" && (
              <a href="/api/graphql" className="text-sm text-stone-500 hover:underline">
                GraphiQL
              </a>
            )}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
