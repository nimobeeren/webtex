-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT E'',
    "bibliography" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
