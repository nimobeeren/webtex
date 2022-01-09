-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT E'',
    "bibliography" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
