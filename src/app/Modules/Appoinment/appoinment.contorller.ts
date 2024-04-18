import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AppoinmentServices } from './appoinment.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IAuthUser } from '../../interfaces/common';
import pick from '../../../shared/pick';

const createAppoinment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const result = await AppoinmentServices.createAppoinment(user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Appoinment created Successfully !',
      data: result,
    });
  }
);
const getMyAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;

    const filters = pick(req.query, ['status', 'paymentStatus']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await AppoinmentServices.getMyAppointment(
      user,
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'My Appoinment Retrived Successfully !',
      data: result,
    });
  }
);
const getAllAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ['status', 'paymentStatus']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    //task after do

    const result = await AppoinmentServices.getAllAppointment(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Appoinment Retrived Successfully !',
      data: result,
    });
  }
);
const changeAppoinmentStatus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user as IAuthUser;
    const result = await AppoinmentServices.changeAppoinmentStatus(
      id,
      status,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Appoinment Status Changed Successfully !',
      data: result,
    });
  }
);
export const AppoinmentControllers = {
  createAppoinment,
  getMyAppointment,
  getAllAppointment,
  changeAppoinmentStatus,
};
