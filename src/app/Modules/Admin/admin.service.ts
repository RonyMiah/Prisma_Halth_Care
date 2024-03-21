import { Admin, Prisma, userStatus } from '@prisma/client';
import { searchAbleFields } from './ admin.constant';
import { paginateHelper } from '../../../helpars/paginateHalpers';
import prisma from '../../../shared/prisma';

const getAllDataFromDB = async (params: any, options: any) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip } = paginateHelper.calculatePagination(options);
  const andConditon: Prisma.AdminWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andConditon.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  if (params.searchTerm) {
    andConditon.push({
      OR: searchAbleFields.map((value) => ({
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

  //   console.dir(andConditon, { depth: 'infinity' });

  const whereConditions: Prisma.AdminWhereInput = {
    AND: andConditon,
  };

  console.log(options);

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createdAt: 'desc' }, // time er opore base kore sorting
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleDataFromDB = async (id: string): Promise<Admin | null> => {
  //check user is exists or not
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateDataFromDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  //check user is already exists or not
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

//when Delete User Data Make Sure Admin and user also deleted use transition
const deleteDataFromDB = async (id: string): Promise<Admin | null> => {
  //Use Trasition becouse delete 2 table

  const result = await prisma.$transaction(async (transectionClient) => {
    await prisma.admin.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const adminDeletedData = await transectionClient.admin.delete({
      where: {
        id,
      },
    });

    await transectionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });

  return result;
};

const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.update({
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
        email: adminDeletedData.email,
      },
      data: {
        status: userStatus.DELETED,
      },
    });
    return adminDeletedData;
  });
  return result;
};

export const AdminService = {
  getAllDataFromDB,
  getSingleDataFromDB,
  updateDataFromDB,
  deleteDataFromDB,
  softDeleteFromDB,
};
