import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { IAuthUser } from '../../interfaces/common';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { PaymentServices } from './payment.service';

const initPayment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const { appoinmentId } = req.params;
    const result = await PaymentServices.initPayment(appoinmentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment Initiate Successfully !',
      data: result,
    });
  }
);
const validatePayment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const result = await PaymentServices.validatePayment(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment Validate Successfully !',
      data: result,
    });
  }
);

export const PaymentControllers = {
  initPayment,
  validatePayment,
};
