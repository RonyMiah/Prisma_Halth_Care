import {
  PaymentStatus,
  Prisma,
  Schedule,
  userRole,
  Doctor,
  AppointmentStatus,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IAuthUser } from '../../interfaces/common';
import { v4 as uuidv4 } from 'uuid';
import { TPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpars/paginateHalpers';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createAppoinment = async (user: IAuthUser, payload: any) => {
  const PatientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: PatientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    //update doctorSchedules
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    //create payment Table

    // const transactionId = uuidv4()
    const today = new Date();
    const transactionId = `PH-HelthCare-${today.getFullYear()}-${today.getMonth()}-${today.getDay()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()} `;
    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });
  return result;
};

const getMyAppointment = async (
  user: IAuthUser,
  filters: any,
  options: TPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { ...filterData } = filters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === userRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user.email,
      },
    });
  } else if (user?.role === userRole.DOCTOR) {
    andConditions.push({
      patient: {
        email: user.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterCondition = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditions.push(...filterCondition);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createAt: 'desc' },
    include:
      user?.role === userRole.PATIENT
        ? {
            doctor: true,
            schedule: true,
          }
        : {
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
            schedule: true,
          },
    // time er opore base kore sorting
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
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
const getAllAppointment = async (filters: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { ...filterData } = filters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    const filterCondition = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditions.push(...filterCondition);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createAt: 'desc' },
    include: {
      doctor: true,
      schedule: true,
      patient: true,
    },

    // time er opore base kore sorting
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
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

const changeAppoinmentStatus = async (
  id: string,
  status: AppointmentStatus,
  user: IAuthUser
) => {
  const appoinmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.role === userRole.DOCTOR) {
    if (!(user.email === appoinmentData.doctor.email)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        ' This is not Your Appointment'
      );
    }
  }
  const result = await prisma.appointment.update({
    where: {
      id: id,
    },
    data: {
      status: status,
    },
  });

  return result;
};
const cancleUnpaidAppoinments = async () => {
  const thrirtyMinitAgo = new Date(Date.now() - 30 * 60 * 1000);

  const unPaidAppoinments = await prisma.appointment.findMany({
    where: {
      createAt: {
        lte: thrirtyMinitAgo,
      },
      paymentStatus: PaymentStatus.UNPAID,
    },
  });

  const appoinmentIdesToCancel = unPaidAppoinments.map(
    (appoinment) => appoinment.id
  );

  //delete appoinments

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appoinmentIdesToCancel,
        },
      },
    });

    await tx.appointment.deleteMany({
      where: {
        id: {
          in: appoinmentIdesToCancel,
        },
      },
    });

    for (const unPaidAppoinment of unPaidAppoinments) {
      await tx.doctorSchedules.updateMany({
        where: {
          doctorId: unPaidAppoinment.doctorId,
          scheduleId: unPaidAppoinment.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    }
  });

  console.log('Updated ..');
};
export const AppoinmentServices = {
  createAppoinment,
  getMyAppointment,
  getAllAppointment,
  changeAppoinmentStatus,
  cancleUnpaidAppoinments,
};
