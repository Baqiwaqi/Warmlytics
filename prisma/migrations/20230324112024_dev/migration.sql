-- CreateTable
CREATE TABLE "CurrentInsulation" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rc" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrentInsulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetterInsulation" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rc" DOUBLE PRECISION NOT NULL,
    "ipv" INTEGER NOT NULL,
    "startPrice" DOUBLE PRECISION NOT NULL,
    "squarePrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BetterInsulation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurrentInsulation_code_key" ON "CurrentInsulation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "BetterInsulation_code_key" ON "BetterInsulation"("code");
