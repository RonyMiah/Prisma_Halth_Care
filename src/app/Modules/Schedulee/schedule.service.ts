import { addHours, addMinutes, format } from 'date-fns';
import prisma from '../../../shared/prisma';
import { Prisma, Schedule } from '@prisma/client';
import { IFilterRequest, ISchedule } from './schedule.interface';
import { TPaginationOptions } from '../../interfaces/pagination';
import { IAuthUser } from '../../interfaces/common';
import { paginationHelper } from '../../../helpars/paginateHalpers';

const convertDateTime = async (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
};

const createSchedule = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;
  const intervalTime = 30;
  const schedules = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, 'yyy-MM-dd')}`,
          Number(startTime.split(':')[0])
        ),
        Number(startTime.split(':')[1])
      )
    );
    // console.log(startDateTime);

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, 'yyy-MM-dd')}`,
          Number(endTime.split(':')[0])
        ),
        Number(endTime.split(':')[1])
      )
    );

    while (startDateTime < endDateTime) {
      //Normal Date Time For Bangladesh

      // const scheduleData = {
      //   startDateTime: startDateTime,
      //   endDateTime: addMinutes(startDateTime, intervalTime),
      // };

      const startDateTimeUTC = await convertDateTime(startDateTime);
      const endDateTimeUTC = await convertDateTime(
        addMinutes(startDateTime, intervalTime)
      );

      //UTC Date Time International
      const scheduleData = {
        startDateTime: startDateTimeUTC,
        endDateTime: endDateTimeUTC,
      };
      //   console.log(scheduleData); //Console.log

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

const getAllFromDB = async (
  filters: IFilterRequest,
  options: TPaginationOptions,
  user: IAuthUser
) => {
  const { startDate, endDate, ...filterData } = filters;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const andConditon: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    andConditon.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditon.push(...filterConditions);
  }

  // console.dir(andConditon, { depth: 'infinity' });

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditon.length > 0 ? { AND: andConditon } : {};

  //doctor Schedule Find
  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  const scheduleIds = doctorSchedules.map((schedule) => schedule.scheduleId);

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: scheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createdAt: 'desc' },
    // time er opore base kore sorting
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: scheduleIds,
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

const getSingleSchedule = async (id: string) => {
  const result = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });

  //** utc thaika jekono local date aa convart hobe  console

  // console.log(
  // result?.startDateTime.getHours() + ':' + result?.startDateTime.getMinutes()
  // );

  //**utc Formate

  // console.log(
  // result?.startDateTime.getUTCHours() + ':' + result?.startDateTime.getUTCMinutes()
  // );

  return result;
};
const deleteSchedule = async (id: string) => {
  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ScheduleServices = {
  createSchedule,
  getAllFromDB,
  getSingleSchedule,
  deleteSchedule,
};
