import { Patient, Prisma, userStatus } from '@prisma/client';
import { paginationHelper } from '../../../helpars/paginateHalpers';
import { TPaginationOptions } from '../../interfaces/pagination';
import { IPatientFilterRequest, IPatientUpdate } from './patient.interface';
import { patientSearchableFields } from './patient.constant';
import prisma from '../../../shared/prisma';

const getAllPatientFromDB = async (
  params: IPatientFilterRequest,
  options: TPaginationOptions
) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const andConditon: Prisma.PatientWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditon.push(...filterConditions);
  }

  if (searchTerm) {
    andConditon.push({
      OR: patientSearchableFields.map((value) => ({
        [value]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  andConditon.push({
    isDeleted: false,
  });

  // console.dir(andConditon, { depth: 'infinity' });

  const whereConditions: Prisma.PatientWhereInput =
    andConditon.length > 0 ? { AND: andConditon } : {};

  // console.log(options);

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createdAt: 'desc' },
    include: {
      medicalReport: true,
      patientHealthData: true,
    }, // time er opore base kore sorting
  });

  const total = await prisma.patient.count({
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

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: Partial<IPatientUpdate>) => {
  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (tx) => {
    //UPdate Patient
    await tx.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });

    // create or update patient health data
    if (patientHealthData) {
      await tx.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id },
      });
    }

    // create medicalReport
    if (medicalReport) {
      await tx.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });

  //responseData From DB patient
  const responseData = await prisma.patient.findUnique({
    where: {
      id: patientInfo.id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return responseData;
};

const deleteFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.$transaction(async (tx) => {
    //delete medical report
    await tx.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });

    //deletee patientHelthData
    await tx.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });

    //delete patient data
    const deletedPatient = await tx.patient.delete({
      where: {
        id,
      },
    });

    //delete user patient

    await tx.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });

    return deletedPatient;
  });

  return result;
};

const softDeleted = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    //update isDeleted Patient
    const deletedPatient = await tx.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    // update user status deleted

    await tx.user.update({
      where: {
        email: deletedPatient.email,
      },
      data: {
        status: userStatus.DELETED,
      },
    });
  });

  return result;
};

export const PatientServices = {
  getAllPatientFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleted,
};
