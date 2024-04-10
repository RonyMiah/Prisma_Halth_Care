import { DoctorSchedules, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IAuthUser } from '../../interfaces/common';
import { TPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpars/paginateHalpers';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createDoctorSchedule = async (
  user: IAuthUser,
  payload: { scheduleIds: string[] }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const getMySchedule = async (
  filters: any,
  options: TPaginationOptions,
  user: IAuthUser
) => {
  const { startDate, endDate, ...filterData } = filters;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const andConditon: Prisma.DoctorSchedulesWhereInput[] = [];

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  andConditon.push({
    doctorId: doctorData.id,
  });

  if (startDate && endDate) {
    andConditon.push({
      AND: [
        {
          schedul: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedul: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === 'string' &&
      filterData.isBooked === 'true'
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === 'string' &&
      filterData.isBooked === 'false'
    ) {
      filterData.isBooked = false;
    }
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditon.push(...filterConditions);
  }

  // console.dir(andConditon, { depth: 'infinity' });

  const whereConditions: Prisma.DoctorSchedulesWhereInput =
    andConditon.length > 0 ? { AND: andConditon } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
    // time er opore base kore sorting
  });

  const total = await prisma.doctorSchedules.count({
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

const getAllSchedule = async (filters: any, options: TPaginationOptions) => {
  const { startDate, endDate, ...filterData } = filters;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const andConditon: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDate && endDate) {
    andConditon.push({
      AND: [
        {
          schedul: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedul: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === 'string' &&
      filterData.isBooked === 'true'
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === 'string' &&
      filterData.isBooked === 'false'
    ) {
      filterData.isBooked = false;
    }
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditon.push(...filterConditions);
  }

  // console.dir(andConditon, { depth: 'infinity' });

  const whereConditions: Prisma.DoctorSchedulesWhereInput =
    andConditon.length > 0 ? { AND: andConditon } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
    // time er opore base kore sorting
  });

  const total = await prisma.doctorSchedules.count({
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

const deleteFromDB = async (id: string, user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const isBookedShedule = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: id,
      },
      isBooked: true,
    },
  });
  if (isBookedShedule) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You can not deleted the schedule because of the schedule is already booked !'
    );
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: id,
      },
    },
  });
  return result;
};

export const DoctorScheduleServices = {
  createDoctorSchedule,
  getMySchedule,
  deleteFromDB,
  getAllSchedule,
};
