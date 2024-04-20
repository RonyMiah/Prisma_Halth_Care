import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import AppError from '../../errors/AppError';
import { IAuthUser } from '../../interfaces/common';
import { TPaginationOptions } from '../../interfaces/pagination';
import { Prisma, userRole } from '@prisma/client';
import { paginationHelper } from '../../../helpars/paginateHalpers';

const createReviews = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appoinmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });

  if (!(patientData.id === appoinmentData.patientId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This is not your appointment ');
  }

  return await prisma.$transaction(async (tx) => {
    const result = await tx.review.create({
      data: {
        appointmentId: appoinmentData.id,
        doctorId: appoinmentData.doctorId,
        patientId: appoinmentData.patientId,
        rating: payload.rating,
        comment: payload.comment,
      },
    });

    const averageRating = await tx.review.aggregate({
      _avg: {
        rating: true,
      },
    });

    // average rating now ... {_avg : {rating: 4.5}}

    await tx.doctor.update({
      where: {
        id: result.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });
    return result;
  });
};

const getAllReviews = async (
  user: IAuthUser,
  options: TPaginationOptions,
  filters: any
) => {
  const { doctorEmail, patientEmail, ...filterData } = filters;
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const andConditon: Prisma.ReviewWhereInput[] = [];

  if (!(user?.role === userRole.ADMIN || userRole.SUPPER_ADMIN)) {
    throw new AppError(httpStatus.BAD_REQUEST, ' You are not Authorized');
  }

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
  // andConditon.push({
  //   patient: {
  //     email: user?.email,
  //   },
  // });

  const whereConditions: Prisma.ReviewWhereInput =
    andConditon.length > 0 ? { AND: andConditon } : {};

  const result = await prisma.review.findMany({
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

  const total = await prisma.review.count({
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
export const ReviewServices = {
  createReviews,
  getAllReviews,
};
