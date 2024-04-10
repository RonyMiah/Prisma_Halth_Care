import { Request } from 'express';
import { IFile } from '../../interfaces/file';
import { fileUploader } from '../../../shared/fileUploader';
import prisma from '../../../shared/prisma';

const createSpecialties = async (req: Request) => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinaryData = await fileUploader.uploadToCloudinary(file);

    req.body.icon = uploadToCloudinaryData?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getSpecialties = async () => {
  const result = await prisma.specialties.findMany();

  return result;
};

const deleteSpecialties = async (id: string) => {
  const SpecialtiesData = await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesServices = {
  createSpecialties,
  getSpecialties,
  deleteSpecialties,
};
