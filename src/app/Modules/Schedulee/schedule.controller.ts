import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ScheduleServices } from './schedule.service';
import { IAuthUser } from '../../interfaces/common';
import pick from '../../../shared/pick';

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.createSchedule(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shedule Created successfully !!',
    data: result,
  });
});

const getAllFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const filters = pick(req.query, ['startDate', 'endDate']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await ScheduleServices.getAllFromDB(filters, options, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Schedule Fatched successfully !!',
      data: result,
    });
  }
);
const getSingleSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleServices.getSingleSchedule(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule Retrived  successfully !',
    data: result,
  });
});
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleServices.deleteSchedule(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Schedule Deleted successfully',
    data: result,
  });
});

export const ScheduleControllers = {
  createSchedule,
  getAllFromDB,
  getSingleSchedule,
  deleteSchedule,
};
