import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DoctorService } from './doctor.service';
import { getSingleFilePath } from '../../../shared/getFilePath';

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  let data = req.body;
  if (req.body.data) {
    data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
  }
  const image = getSingleFilePath(req.files, 'image');
  if (image) {
    data.image = image;
  }
  const result = await DoctorService.createDoctorToDB(data);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Doctor created successfully',
    data: result,
  });
});

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const { data, pagination } = await DoctorService.getAllDoctorsFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctors retrieved successfully',
    pagination,
    data,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getDoctorByIdFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctor retrieved successfully',
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let data = req.body;
  if (req.body.data) {
    data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
  }
  const image = getSingleFilePath(req.files, 'image');
  if (image) {
    data.image = image;
  }
  const result = await DoctorService.updateDoctorToDB(id, data);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctor updated successfully',
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteDoctorFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctor and associated records deleted successfully',
    data: result,
  });
});

const getDoctorPatients = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { doctor, data, pagination } = await DoctorService.getDoctorPatientsFromDB(
    id,
    req.query
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctor patients retrieved successfully',
    pagination,
    data: {
      doctor,
      patients: data,
    },
  });
});

const addPatientToDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  let data = req.body;
  if (req.body.data) {
    data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
  }
  const image = getSingleFilePath(req.files, 'image');
  if (image) {
    data.image = image;
  }
  const result = await DoctorService.addPatientToDoctorInDB(id, data);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Patient added under doctor successfully',
    data: result,
  });
});

const removePatientFromDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id, patientId } = req.params;
  const result = await DoctorService.removePatientFromDoctorInDB(id, patientId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patient removed from doctor successfully',
    data: result,
  });
});

export const DoctorController = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorPatients,
  addPatientToDoctor,
  removePatientFromDoctor,
};
