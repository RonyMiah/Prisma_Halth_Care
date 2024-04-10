import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { Request, Response } from 'express';
import { DoctorServices } from './doctor.service';
import { doctorFiltarableFilds } from './doctor.constant';

const getAllDataFromDB = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, doctorFiltarableFilds);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await DoctorServices.getAllDataFromDB(filter, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor Data Fatch Successfully ',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleDataFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorServices.getSingleDataFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor Retrived Successfully ',
    data: result,
  });
});
const updateDataFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorServices.updateDataFromDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor DataUpdate Successfully ',
    data: result,
  });
});
const deleteDataFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorServices.deleteDataFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor Data Deleted Successfully ',
    data: result,
  });
});

const softDeleted = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorServices.softDeleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor soft deleted successfully! ',
    data: result,
  });
});

export const DoctorController = {
  getAllDataFromDB,
  getSingleDataFromDB,
  updateDataFromDB,
  deleteDataFromDB,
  softDeleted,
};
