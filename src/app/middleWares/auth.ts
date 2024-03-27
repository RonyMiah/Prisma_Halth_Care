import { NextFunction, Request, Response } from 'express';
import { JwtHelpares } from '../../helpars/jwtHeplers';
import config from '../config';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized !');
      }

      const decodedData = JwtHelpares.verifyToken(
        token,
        config.jwt_secret as string
      );

      if (roles.length && !roles.includes(decodedData.role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Forbidden!');
      }
      req.user = decodedData;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
