import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Check if water bottle already exists
  const existingProduct = await prisma.product.findFirst({
    where: { name: 'Water Bottle' },
  });

  if (!existingProduct) {
    const waterBottle = await prisma.product.create({
      data: {
        name: 'Water Bottle',
        description: 'High-quality reusable water bottle',
        price: 1.0,
        active: true,
      },
    });
    console.log('Created water bottle product:', waterBottle);
  } else {
    console.log('Water bottle product already exists');
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

