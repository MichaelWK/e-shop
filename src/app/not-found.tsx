import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link href="/" className="underline">
        Back to the shop
      </Link>
    </div>
  );
}
