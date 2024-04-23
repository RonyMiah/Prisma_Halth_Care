import { userRole } from '@prisma/client';
import prisma from '../src/shared/prisma';
import config from '../src/app/config';
import bcrypt from 'bcrypt';
const seedSupperAdmin = async () => {
  try {
    //check supper admin is already exists or not if don't exists create

    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: userRole.SUPPER_ADMIN,
      },
    });
    if (isExistSuperAdmin) {
      console.log('Supper admin already exists !');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.super_admin.password as string,
      12
    );
    const supperAdminData = await prisma.user.create({
      data: {
        email: config.super_admin.email as string,
        password: hashedPassword,
        role: userRole.SUPPER_ADMIN,
        admin: {
          create: {
            name: 'Super Admin',
            contactNumber: '0190000002',
          },
        },
      },
    });

    console.log('Super admin Created Successfully ! ', supperAdminData);
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSupperAdmin();
