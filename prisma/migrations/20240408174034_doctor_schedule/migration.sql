/*
  Warnings:

  - You are about to drop the `DoctorSchedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "DoctorSchedules";

-- CreateTable
CREATE TABLE "doctor_schedules" (
    "doctorId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL,
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "doctor_schedules_pkey" PRIMARY KEY ("doctorId","scheduleId")
);
