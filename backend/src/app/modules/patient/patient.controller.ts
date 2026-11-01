import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PatientService } from './patient.service';
import { getSingleFilePath } from '../../../shared/getFilePath';

const createPatient = catchAsync(async (req: Request, res: Response) => {
  let data = req.body;
  if (req.body.data) {
    data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
  }
  const image = getSingleFilePath(req.files, 'image');
  if (image) {
    data.image = image;
  }
  const result = await PatientService.createPatientToDB(data);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Patient created successfully',
    data: result,
  });
});

const getAllPatients = catchAsync(async (req: Request, res: Response) => {
  const { data, pagination } = await PatientService.getAllPatientsFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patients retrieved successfully',
    pagination,
    data,
  });
});

const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.getPatientByIdFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patient retrieved successfully',
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let data = req.body;
  if (req.body.data) {
    data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
  }
  const image = getSingleFilePath(req.files, 'image');
  if (image) {
    data.image = image;
  }
  const result = await PatientService.updatePatientToDB(id, data);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patient updated successfully',
    data: result,
  });
});

const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.deletePatientFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patient deleted successfully',
    data: result,
  });
});

export const PatientController = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
