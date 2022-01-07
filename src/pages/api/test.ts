import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  await prisma.document.create({
    data: {
      title: "My First Document"
    }
  });

  const documents = await prisma.document.findMany();

  res.status(200).json(documents);
}
