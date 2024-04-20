import { AppointmentStatus, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IAuthUser } from '../../interfaces/common';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpars/paginateHalpers';

const insertIntoDB = async (user: IAuthUser, payload: any) => {
  const appoinmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
    },
    include: {
      doctor: true,
    },
  });

  if (!(appoinmentData.doctor.email === user?.email)) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'This is not your Appoinment !'
    );
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appoinmentData.id,
      doctorId: appoinmentData.doctorId,
      patientId: appoinmentData.patientId,
      instructions: payload.instructions,
      followUpDate: payload.followUpDate,
    },
    include: {
      patient: true,
    },
  });

  return result;

  //   console.log(appoinmentData);
};

const getAllFromDB = async (
  user: IAuthUser,
  options: TPaginationOptions,
  filters: any
) => {
  console.log(filters)
  const { doctorEmail, patientEmail, ...filterData } = filters;
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const andConditon: Prisma.PrescriptionWhereInput[] = [];

  andConditon.push({
    doctor: {
      email: doctorEmail,
    },
  });
  andConditon.push({
    patient: {
      email: patientEmail,
    },
  });
  andConditon.push({
    patient: {
      email: user?.email,
    },
  });

  const whereConditions: Prisma.PrescriptionWhereInput =
    andConditon.length > 0 ? { AND: andConditon } : {};

  const result = await prisma.prescription.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
    include: {
      appointment: true,
      patient: true,
      doctor: true,
    },
  });

  const total = await prisma.prescription.count({
    where: {
      patient: {
        email: user?.email,
      },
    },
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const PrescriptionServices = {
  insertIntoDB,
  getAllFromDB,
};
