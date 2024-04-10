import { Doctor, Prisma, userStatus } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { TPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpars/paginateHalpers';
import { doctorSearchableFields } from './doctor.constant';
import { IDoctorFilterRequest, IDoctorUpdate } from './doctor.interface';

const getAllDataFromDB = async (
  params: IDoctorFilterRequest,
  options: TPaginationOptions
) => {
  const { searchTerm, specialties, ...filterData } = params;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const andConditon: Prisma.DoctorWhereInput[] = [];

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
      OR: doctorSearchableFields.map((value) => ({
        [value]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // Doctor Table >>> DoctorSpecialties Table >>> Specialties Table > title [[Flow Scheema  ]]
  if (specialties && specialties.length > 0) {
    andConditon.push({
      doctorSpecialties: {
        some: {
          //jekon akta hoilei holo er jonno some query
          specialties: {
            title: {
              contains: specialties,
              mode: 'insensitive',
            },
          },
        },
      },
    });
  }

  andConditon.push({
    isDeleted: false,
  });

  // console.dir(andConditon, { depth: 'infinity' });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditon.length > 0 ? { AND: andConditon } : {};

  // console.log(options);

  const result = await prisma.doctor.findMany({
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
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    }, // time er opore base kore sorting
  });

  const total = await prisma.doctor.count({
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

const getSingleDataFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

const updateDataFromDB = async (id: string, payload: IDoctorUpdate) => {
  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // console.log(specialties, doctorData);
  await prisma.$transaction(async (transectionClient) => {
    await transectionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      //Delete Specialties
      const deleteSpecialtiesIds = specialties.filter(
        (specialty) => specialty.isDeleted
      );
      // console.log(deleteSpecialtiesIds)
      for (const specialty of deleteSpecialtiesIds) {
        await transectionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialitiesId, //.....
          },
        });
      }
      //create specialties

      const createSpecialtiesIds = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      // console.log(createSpecialtiesIds);

      for (const specialty of createSpecialtiesIds) {
        await transectionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialitiesId,
          },
        });
      }
    }
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: true,
    },
  });

  return result;
};

//when Delete User Data Make Sure Admin and user also deleted use transition
const deleteDataFromDB = async (id: string): Promise<Doctor | null> => {
  //Use Trasition becouse delete 2 table

  const result = await prisma.$transaction(async (transectionClient) => {
    await prisma.doctor.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const doctorDeletedData = await transectionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transectionClient.user.delete({
      where: {
        email: doctorDeletedData.email,
      },
    });
    return doctorDeletedData;
  });

  return result;
};

const softDeleteFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.$transaction(async (tx) => {
    const doctorDeletedData = await tx.doctor.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });
    await tx.user.update({
      where: {
        email: doctorDeletedData.email,
      },
      data: {
        status: userStatus.DELETED,
      },
    });
    return doctorDeletedData;
  });
  return result;
};

export const DoctorServices = {
  getAllDataFromDB,
  getSingleDataFromDB,
  updateDataFromDB,
  deleteDataFromDB,
  softDeleteFromDB,
};
