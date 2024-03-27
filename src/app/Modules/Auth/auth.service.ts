import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { JwtHelpares } from './../../../helpars/jwtHeplers';
import prisma from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import { userRole, userStatus } from '@prisma/client';
import config from '../../config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import emailSender from './emailSender';

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: userStatus.ACTIVE,
    },
  });

  const comparieData: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!comparieData) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password Do not Match ');
  }
  const accessToken = JwtHelpares.generateToken(
    { email: userData.email, role: userData.role, id: userData.id },
    config.jwt_secret as string,
    config.jwt_expire_in as string
  );
  const refreshToken = JwtHelpares.generateToken(
    { email: userData.email, role: userData.role, id: userData.id },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expire_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = JwtHelpares.verifyToken(
      token,
      config.jwt_refresh_secret as string
    );
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Authorized !');
  }

  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: userStatus.ACTIVE,
    },
  });
  const accessToken = JwtHelpares.generateToken(
    {
      email: isUserExists.email,
      role: isUserExists.role,
    },
    config.jwt_secret as string,
    config.jwt_expire_in as string
  );

  return {
    accessToken,
    needPasswordChange: isUserExists.needPasswordChange,
  };
};

const changePassword = async (
  user: any,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: userStatus.ACTIVE,
    },
  });

  //check old password
  const isCurrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCurrectPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'password Incurrect !');
  }

  //hashed Password
  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: 'Password Changed Successfully !',
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: userStatus.ACTIVE,
    },
  });
  const resetPassToken = JwtHelpares.generateToken(
    { email: userData.email, role: userData.role },
    config.reset_pass_secret as string,
    config.reset_pass_expire_in as string
  );

  //Generate a Reset Link
  // http://localhost:3000/reset-password?email=jaman@gmail.com&token=sdfwesadfv

  const resetPasswordLink =
    config.reset_pass_link + `?email=${userData.email}&token=${resetPassToken}`;

  await emailSender(
    userData.email,
    ` 
    <div>
        <p>Dear User ,</p> 
        <p> Your Password Reset Link 
         <a href=${resetPasswordLink} >
             <button>
                Reset Password  
             </button>
         </a>
         </p>
    </div>
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { email: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: userStatus.ACTIVE,
    },
  });

  const isValidToken = JwtHelpares.verifyToken(
    token,
    config.reset_pass_secret as string
  );

  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbiden !');
  }

  //hash Password
  const hashedPassword = bcrypt.hashSync(payload.password, 12);

  //update password in database

  await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
