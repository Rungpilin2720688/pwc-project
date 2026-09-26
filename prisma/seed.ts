import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCT_COUNT = Number(process.env.SEED_PRODUCT_COUNT ?? 25_000);
const BATCH_SIZE = 1_000;
const FORCE = process.env.SEED_FORCE === "true";

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T>(items: readonly T[]): T => items[Math.floor(rand() * items.length)] as T;

const CATALOGUE: Record<string, { nouns: readonly string[]; price: [number, number] }> = {
  Electronics: { nouns: ["Headphones", "Speaker", "Monitor", "Keyboard", "Mouse", "Webcam"], price: [15, 1500] },
  Books: { nouns: ["Novel", "Cookbook", "Guide", "Anthology", "Biography", "Atlas"], price: [5, 80] },
  Home: { nouns: ["Lamp", "Rug", "Vase", "Clock", "Mirror", "Cushion"], price: [10, 400] },
  Kitchen: { nouns: ["Knife Set", "Blender", "Kettle", "Pan", "Mug", "Cutting Board"], price: [8, 350] },
  Sports: { nouns: ["Yoga Mat", "Dumbbell", "Football", "Racket", "Water Bottle", "Jump Rope"], price: [6, 300] },
  Toys: { nouns: ["Puzzle", "Building Set", "Plush Bear", "Board Game", "Kite", "Robot"], price: [5, 150] },
  Beauty: { nouns: ["Serum", "Face Cream", "Lip Balm", "Perfume", "Hair Oil", "Cleanser"], price: [4, 200] },
  Fashion: { nouns: ["Jacket", "Sneakers", "Backpack", "Scarf", "Sunglasses", "Watch"], price: [12, 600] },
  Garden: { nouns: ["Planter", "Hose", "Shovel", "Bird Feeder", "Seed Kit", "Lantern"], price: [5, 250] },
  Office: { nouns: ["Notebook", "Desk Organizer", "Pen Set", "Chair Cushion", "Stapler", "Desk Mat"], price: [3, 300] },
};
const CATEGORIES = Object.keys(CATALOGUE);

const ADJECTIVES = [
  "Classic", "Modern", "Compact", "Premium", "Eco", "Smart", "Vintage", "Ultra",
  "Essential", "Deluxe", "Portable", "Minimal", "Rugged", "Lightweight", "Pro",
] as const;
const BRANDS = ["Nordic", "Acme", "Lumen", "Kaiyo", "Orbit", "Siam", "Vertex", "Maple", "Juniper", "Atlas"] as const;
const AUTHORS = ["Alex", "Mai", "Somchai", "Priya", "Jordan", "Nok", "Chen", "Sara", "Tom", "Ploy", "Liam", "Fah"] as const;
const COMMENTS: Record<number, readonly string[]> = {
  1: ["Broke after a week, very disappointed.", "Not as described. Would not buy again."],
  2: ["Quality is below what I expected for the price.", "It works, but only just."],
  3: ["Decent product, nothing special.", "Does the job. Delivery was slow."],
  4: ["Really good value, would recommend.", "Solid quality and looks great."],
  5: ["Absolutely love it, exceeded expectations!", "Perfect. Buying another one as a gift."],
};
const RATING_DISTRIBUTION = [1, 2, 3, 3, 4, 4, 4, 5, 5, 5] as const;

const DAY_MS = 86_400_000;

function buildBatch(startId: number, size: number) {
  const products: Prisma.ProductCreateManyInput[] = [];
  const reviews: Prisma.ReviewCreateManyInput[] = [];

  for (let i = 0; i < size; i++) {
    const id = startId + i;
    const category = pick(CATEGORIES);
    const { nouns, price } = CATALOGUE[category]!;
    const noun = pick(nouns);
    const adjective = pick(ADJECTIVES);
    const brand = pick(BRANDS);

    const ratings = Array.from({ length: int(0, 5) }, () => pick(RATING_DISTRIBUTION));
    for (const rating of ratings) {
      reviews.push({
        productId: id,
        author: pick(AUTHORS),
        rating,
        comment: pick(COMMENTS[rating]!),
        createdAt: new Date(Date.now() - int(0, 365) * DAY_MS - int(0, DAY_MS)),
      });
    }
    const ratingAvg = ratings.length ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

    products.push({
      id,
      name: `${brand} ${adjective} ${noun} ${String.fromCharCode(65 + int(0, 25))}${int(100, 999)}`,
      description: `The ${adjective.toLowerCase()} ${noun.toLowerCase()} from ${brand}, part of our ${category.toLowerCase()} range. Designed for everyday use with a focus on quality and durability.`,
      price: Math.round((price[0] + rand() * (price[1] - price[0])) * 100) / 100,
      category,
      ratingAvg,
      reviewCount: ratings.length,
    });
  }

  return { products, reviews };
}

async function main() {
  const existing = await prisma.product.count();
  if (existing > 0 && !FORCE) {
    console.log(`Database already has ${existing} products, skipping seed (set SEED_FORCE=true to reseed).`);
    return;
  }
  if (existing > 0) {
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
  }

  console.log(`Seeding ${PRODUCT_COUNT} products...`);
  for (let start = 1; start <= PRODUCT_COUNT; start += BATCH_SIZE) {
    const size = Math.min(BATCH_SIZE, PRODUCT_COUNT - start + 1);
    const { products, reviews } = buildBatch(start, size);
    await prisma.product.createMany({ data: products });
    await prisma.review.createMany({ data: reviews });
  }

  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), (SELECT MAX(id) FROM "Product"))`,
  );

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
