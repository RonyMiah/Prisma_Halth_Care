import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.file);
  // console.log(req.body.data);
  const result = await userService.createAdmin(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Created Successfully ',
    // meta: result.meta,
    data: result,
  });
});
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctor(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor Created Successfully ',
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
};
