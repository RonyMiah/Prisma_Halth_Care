import { IAuthUser } from './../../interfaces/common';
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { DoctorScheduleServices } from './doctorSchedule.service';
import pick from '../../../shared/pick';

const createDoctorSchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;

    const result = await DoctorScheduleServices.createDoctorSchedule(
      user,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Doctor Schedule Created successfully !!',
      data: result,
    });
  }
);
const getMySchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await DoctorScheduleServices.getMySchedule(
      filters,
      options,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Schedule Fatched successfully !!',
      data: result,
    });
  }
);
const getAllSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await DoctorScheduleServices.getAllSchedule(
      filters,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Schedule Fatched successfully !!',
      data: result,
    });
  }
);

const deleteFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const { id } = req.params;

    const result = await DoctorScheduleServices.deleteFromDB(id, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Doctor Schedule Deleted successfully !!',
      data: result,
    });
  }
);

export const DoctorScheduleControllers = {
  createDoctorSchedule,
  getMySchedule,
  deleteFromDB,
  getAllSchedule,
};
