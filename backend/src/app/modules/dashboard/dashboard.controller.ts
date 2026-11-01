import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DashboardService } from './dashboard.service';

const getDashboardAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getDashboardAnalyticsFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Dashboard analytics retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getDashboardAnalytics,
};

