import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "keyboards", name: "Keyboards" },
  { slug: "audio", name: "Audio" },
  { slug: "accessories", name: "Accessories" },
];

const products = [
  {
    slug: "mechanical-keyboard-75",
    name: "Mechanical Keyboard 75%",
    description: "Hot-swappable 75% keyboard with gasket mount and PBT keycaps.",
    priceCents: 49900,
    stock: 12,
    category: "keyboards",
  },
  {
    slug: "low-profile-keyboard",
    name: "Low-Profile Keyboard",
    description: "Slim wireless keyboard with tactile switches and 3-device pairing.",
    priceCents: 34900,
    stock: 0,
    category: "keyboards",
  },
  {
    slug: "studio-headphones",
    name: "Studio Headphones",
    description: "Closed-back headphones tuned for mixing and long listening sessions.",
    priceCents: 59900,
    stock: 7,
    category: "audio",
  },
  {
    slug: "usb-microphone",
    name: "USB Microphone",
    description: "Cardioid condenser mic with built-in gain control and monitoring.",
    priceCents: 39900,
    stock: 20,
    category: "audio",
  },
  {
    slug: "desk-mat-xl",
    name: "Desk Mat XL",
    description: "900×400 mm stitched-edge desk mat with a non-slip rubber base.",
    priceCents: 8900,
    stock: 50,
    category: "accessories",
  },
  {
    slug: "monitor-light-bar",
    name: "Monitor Light Bar",
    description: "Asymmetric light bar that lights your desk without screen glare.",
    priceCents: 19900,
    stock: 15,
    category: "accessories",
  },
];

async function main() {
  const categoryIds = new Map<string, string>();

  for (const c of categories) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    categoryIds.set(c.slug, category.id);
  }

  for (const { category, ...p } of products) {
    const categoryId = categoryIds.get(category);
    if (!categoryId) throw new Error(`Unknown category: ${category}`);

    const data = { ...p, categoryId, imageUrl: `https://picsum.photos/seed/${p.slug}/600/600` };
    await prisma.product.upsert({ where: { slug: p.slug }, update: data, create: data });
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
