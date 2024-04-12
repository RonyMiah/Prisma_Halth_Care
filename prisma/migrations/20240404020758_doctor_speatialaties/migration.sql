/*
  Warnings:

  - You are about to drop the `DoctorSpecialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DoctorSpecialties" DROP CONSTRAINT "DoctorSpecialties_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorSpecialties" DROP CONSTRAINT "DoctorSpecialties_specialitiesId_fkey";

-- DropTable
DROP TABLE "DoctorSpecialties";

-- CreateTable
CREATE TABLE "doctor_specialties" (
    "specialitiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("specialitiesId","doctorId")
);

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialitiesId_fkey" FOREIGN KEY ("specialitiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;