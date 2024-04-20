import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { IAuthUser } from '../../interfaces/common';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { PrescriptionServices } from './prescription.service';
import pick from '../../../shared/pick';

const getAllFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const filters = pick(req.query, ['doctorEmail','patientEmail']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await PrescriptionServices.getAllFromDB(user, options, filters);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Prescription Retrived Successfully !',
      meta: result.meta,
      data: result.data,
    });
  }
);
const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const result = await PrescriptionServices.insertIntoDB(user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Prescription Created Successfully !',
      data: result,
    });
  }
);

export const PrescriptionControllers = {
  insertIntoDB,
  getAllFromDB,
};
