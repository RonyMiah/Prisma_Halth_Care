import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { IAuthUser } from '../../interfaces/common';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ReviewServices } from './review.service';
import pick from '../../../shared/pick';

const createReviews = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const result = await ReviewServices.createReviews(user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review Created Successfully !',
      data: result,
    });
  }
);
const getAllReview = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;

    const filters = pick(req.query, ['doctorEmail','patientEmail']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']); 

    const result = await ReviewServices.getAllReviews(user,  options, filters);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review Retrived Successfully !',
      data: result,
    });
  }
);

export const ReviewsControllers = {
  createReviews,
  getAllReview,
};
