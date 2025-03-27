import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.users.createMany({
    data: [
      {
        name: "Admin",
        email: "admin@gmail.com",
        password:
          "$2b$10$BTtyEfgcdnwSrnO0YxkBeOfsY3AnXjUkzhhEzqKLZRwsu.Cwo6WQa",
      },
    ],
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
