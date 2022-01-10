import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const project1 = await prisma.project.upsert({
    where: {
      id: "project1"
    },
    update: {
      title: "My First Project",
      content: "This is the content of the first project."
    },
    create: {
      id: "project1",
      title: "My First Project",
      content: "This is the content of the first project."
    }
  });

  const project2 = await prisma.project.upsert({
    where: {
      id: "project2"
    },
    update: {
      title: "My Second Project",
      content: "This is the content of the second project."
    },
    create: {
      id: "project2",
      title: "My Second Project",
      content: "This is the content of the second project."
    }
  });

  console.log({ project1, project2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
