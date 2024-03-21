import { NextFunction, Request, Response } from 'express';
import { AdminService } from './admin.service';
import pick from '../../../shared/pick';
import { adminFiltarableFilds } from './ admin.constant';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const getAllDataFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error: any) {
    next(error);
  }
};
const getSingleDataFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminService.getSingleDataFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Data Fatch Successfully ',
      // meta: result.meta,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};
const updateDataFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error: any) {
    next(error);
  }
};
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
const softDeleted = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await AdminService.softDeleteFromDB(id);
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

export const AdminController = {
  getAllDataFromDB,
  getSingleDataFromDB,
  updateDataFromDB,
  deleteDataFromDB,
  softDeleted,
};
