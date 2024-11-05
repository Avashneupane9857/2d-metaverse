/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Space` table. All the data in the column will be lost.
  - Added the required column `creatroId` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_creatorId_fkey";

-- AlterTable
ALTER TABLE "Space" DROP COLUMN "creatorId",
ADD COLUMN     "creatroId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_creatroId_fkey" FOREIGN KEY ("creatroId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
