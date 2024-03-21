import { userRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../../shared/prisma';

const createAdmin = async (data: any) => {
  const hashPassword = bcrypt.hashSync(data.password, 12);

  const userData = {
    email: data.admin.email,
    password: hashPassword,
    role: userRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transatctionClient) => {
    await transatctionClient.user.create({
      data: userData,
    });
    const createdAdminData = await transatctionClient.admin.create({
      data: data.admin,
    });

    return createdAdminData;
  });

  return result;
};

export const userService = {
  createAdmin,
};
