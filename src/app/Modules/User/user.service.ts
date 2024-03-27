import { userRole, Doctor } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';
import { fileUploader } from '../../../shared/fileUploader';
import { IFile } from '../../interfaces/file';

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
const createDoctor = async (req: any) => {
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

export const userService = {
  createAdmin,
  createDoctor,
};
