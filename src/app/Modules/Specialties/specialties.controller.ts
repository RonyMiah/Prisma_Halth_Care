import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { SpecialtiesServices } from './specialties.service';

const createSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.createSpecialties(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Specialties Created Successfully !! ',
    data: result,
  });
});
const getSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.getSpecialties();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Specialties Retrived Successfully !! ',
    data: result,
  });
});
const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SpecialtiesServices.deleteSpecialties(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Specialties Deleted Successfully !! ',
    data: result,
  });
});

export const SpecialtiesControllers = {
  createSpecialties,
  getSpecialties,
  deleteSpecialties,
};
