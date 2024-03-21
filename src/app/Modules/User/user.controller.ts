import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createAdmin = async (req: Request, res: Response,next: NextFunction) => {
  //   console.log(req.body);

  try {
    const result = await userService.createAdmin(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Created Successfully ',
      // meta: result.meta,
      data: result,
    });
  } catch (error: any) {
   next(error)
  }
};

export const userController = {
  createAdmin,
};
