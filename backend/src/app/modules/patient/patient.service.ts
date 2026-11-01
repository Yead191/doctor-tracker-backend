import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';
import { patientSearchableFields } from './patient.constants';
import { IPatient } from './patient.interface';
import { Patient } from './patient.model';
import { Doctor } from '../doctor/doctor.model';
import unlinkFile from '../../../shared/unlinkFile';

const createPatientToDB = async (payload: IPatient) => {
  try {
    // Check if assigned doctor exists
    const isDoctorExist = await Doctor.findById(payload.doctor);
    if (!isDoctorExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Assigned doctor not found');
    }

    const result = await (
      await Patient.create(payload)
    ).populate('doctor', 'name specialization hospital email phone');

    return result;
  } catch (error) {
    if (payload.image) {
      unlinkFile(payload.image);
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, error as string);
  }
};

const getAllPatientsFromDB = async (query: Record<string, unknown>) => {
  const patientQuery = new QueryBuilder(
    Patient.find().populate(
      'doctor',
      'name specialization hospital email phone',
    ),
    query,
  )
    .search(patientSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await patientQuery.modelQuery;
  const pagination = await patientQuery.getPaginationInfo();

  return {
    data,
    pagination,
  };
};

const getPatientByIdFromDB = async (id: string) => {
  const result = await Patient.findById(id).populate(
    'doctor',
    'name specialization hospital email phone image',
  );
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');
  }

  return result;
};

const updatePatientToDB = async (id: string, payload: Partial<IPatient>) => {
  try {
    const isExist = await Patient.findById(id);
    if (!isExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');
    }

    if (payload.doctor) {
      const isDoctorExist = await Doctor.findById(payload.doctor);
      if (!isDoctorExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Assigned doctor not found');
      }
    }

    if (payload.image && payload.image !== isExist.image) {
      if (isExist.image) {
        unlinkFile(isExist.image);
      }
    }

    const result = await Patient.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).populate('doctor', 'name specialization hospital email phone');

    return result;
  } catch (error) {
    if (payload.image) {
      unlinkFile(payload.image);
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, error as string);
  }
};

const deletePatientFromDB = async (id: string) => {
  const isExist = await Patient.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');
  }

  if (isExist && isExist.image) {
    unlinkFile(isExist.image);
  }

  const result = await Patient.findByIdAndDelete(id);
  return result;
};

export const PatientService = {
  createPatientToDB,
  getAllPatientsFromDB,
  getPatientByIdFromDB,
  updatePatientToDB,
  deletePatientFromDB,
};
