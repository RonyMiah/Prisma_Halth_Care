import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { MetaServices } from './meta.service';
import { IAuthUser } from '../../interfaces/common';

const fetchDatabaseMetadata = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;  
    const result = await MetaServices.fetchDatabaseMetadata(user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Meta Data Retrival Successfully ',
      data: result,
    });
  }
);

export const MetaControllers = {
  fetchDatabaseMetadata,
};
