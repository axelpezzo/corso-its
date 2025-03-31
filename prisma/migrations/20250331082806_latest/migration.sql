/*
  Warnings:

  - Made the column `idRace` on table `Character` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idClass` on table `Character` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "idRace" SET NOT NULL,
ALTER COLUMN "idClass" SET NOT NULL;
