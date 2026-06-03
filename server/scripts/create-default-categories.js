const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createDefaultCategories() {
  console.log("Creating plant shop categories...\n");

  const categoriesToCreate = [
    // Растения (vgluhova.ru)
    { name: "Розы" },
    { name: "Гортензии" },
    { name: "Хвойные деревья и кустарники" },
    { name: "Лиственные деревья" },
    { name: "Лиственные кустарники" },
    { name: "Плодовые деревья и кустарники" },
    { name: "Лианы" },
    { name: "Цветы многолетние" },
    { name: "Семена" },
    { name: "Газоны и травосмеси" },
    // Товары (lama-pro.ru - выбранные)
    { name: "Контейнеры и горшки" },
    { name: "Торфяная продукция" },
    { name: "Сетки и агротекстиль" },
    { name: "Инструменты" },
  ];

  try {
    // Delete old electronics categories if they exist
    const oldCategories = ["electronics", "laptops", "audio", "televisions", "cameras", "smartphones", "tablets", "accessories"];
    for (const name of oldCategories) {
      await prisma.category.deleteMany({ where: { name } });
    }

    for (const cat of categoriesToCreate) {
      const existing = await prisma.category.findFirst({ where: { name: cat.name } });
      if (existing) {
        console.log(`Already exists: "${cat.name}"`);
      } else {
        const created = await prisma.category.create({ data: cat });
        console.log(`Created: "${cat.name}" (${created.id})`);
      }
    }

    console.log("\nAll categories ready!");
    const all = await prisma.category.findMany({ orderBy: { name: "asc" } });
    console.log("\nCategories in database:");
    all.forEach(c => console.log(`  - ${c.name}`));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultCategories();
