import { userRole, Doctor, Patient, Prisma, userStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';
import { fileUploader } from '../../../shared/fileUploader';
import { IFile } from '../../interfaces/file';
import { Request } from 'express';
import { TPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../../helpars/paginateHalpers';
import { userSearchAbleFields } from './user.constant';
import { IAuthUser } from '../../interfaces/common';

const createAdmin = async (req: any) => {
  const file: IFile = req.file;

  if (file) {
    const cloudinaryUploadData = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = cloudinaryUploadData?.secure_url;
  }

  const hashPassword = bcrypt.hashSync(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashPassword,
    role: userRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transatctionClient) => {
    await transatctionClient.user.create({
      data: userData,
    });
    const createdAdminData = await transatctionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};

const createDoctor = async (req: any): Promise<Doctor> => {
  const file: IFile = req.file;

  if (file) {
    const cloudinaryUploadData = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = cloudinaryUploadData?.secure_url;
  }

  const hashPassword = bcrypt.hashSync(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashPassword,
    role: userRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transatctionClient) => {
    await transatctionClient.user.create({
      data: userData,
    });
    const createdDoctorData = await transatctionClient.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  return result;
};

const createPatient = async (req: Request): Promise<Patient> => {
  console.log('hello...', req.body);
  const file = req.file as IFile;

  // console.log(req.body);

  if (file) {
    const cloudinaryUploadData = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = cloudinaryUploadData?.secure_url;
  }

  const hashPassword = bcrypt.hashSync(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashPassword,
    role: userRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transatctionClient) => {
    await transatctionClient.user.create({
      data: userData,
    });
    const createdPatientData = await transatctionClient.patient.create({
      data: req.body.patient,
    });

    return createdPatientData;
  });

  return result;
};

const getAllDataFromDB = async (params: any, options: TPaginationOptions) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const andConditon: Prisma.UserWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andConditon.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  if (params.searchTerm) {
    andConditon.push({
      OR: userSearchAbleFields.map((value) => ({
        [value]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  //   console.dir(andConditon, { depth: 'infinity' });

  const whereConditions: Prisma.UserWhereInput =
    andConditon.length > 0
      ? {
          AND: andConditon,
        }
      : {};

  console.log(options);

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      upodatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    }, // time er opore base kore sorting
  });

  const total = await prisma.user.count({
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

const changeProfileStatus = async (id: string, data: userRole) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      upodatedAt: true,
    },
    data,
  });

  return updateUserStatus;
};

const getMe = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;
  if (userInfo.role === userRole.SUPPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === userRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === userRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === userRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const updateProfile = async (user: IAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinaryData = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinaryData?.secure_url;
  }

  let profileInfo;
  if (userInfo.role === userRole.SUPPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === userRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === userRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === userRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }

  return { ...profileInfo };
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllDataFromDB,
  changeProfileStatus,
  getMe,
  updateProfile,
};
