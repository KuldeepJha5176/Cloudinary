/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `duration` on the `video` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "video" DROP COLUMN "duration",
ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "User";
