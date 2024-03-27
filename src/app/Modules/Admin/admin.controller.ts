import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AdminService } from './admin.service';
import pick from '../../../shared/pick';
import { adminFiltarableFilds } from './ admin.constant';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';


const getAllDataFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filter = pick(req.query, adminFiltarableFilds);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await AdminService.getAllDataFromDB(filter, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Data Fatch Successfully ',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleDataFromDB: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const result = await AdminService.getSingleDataFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Data Fatch Successfully ',
      // meta: result.meta,
      data: result,
    });
  }
);
const updateDataFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await AdminService.updateDataFromDB(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update Successfully ',
    // meta: result.meta,
    data: result,
  });
});
const deleteDataFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await AdminService.deleteDataFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Data Deleted Successfully ',
      // meta: result.meta,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const softDeleted: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminService.softDeleteFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data Deleted Successfully ',
    // meta: result.meta,
    data: result,
  });
});

export const AdminController = {
  getAllDataFromDB,
  getSingleDataFromDB,
  updateDataFromDB,
  deleteDataFromDB,
  softDeleted,
};
