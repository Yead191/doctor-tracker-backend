import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import QueryBuilder from '../../builder/QueryBuilder';
import { doctorSearchableFields } from './doctor.constants';
import { IDoctor } from './doctor.interface';
import { Doctor } from './doctor.model';
import { Patient } from '../patient/patient.model';
import { IPatient } from '../patient/patient.interface';
import { patientSearchableFields } from '../patient/patient.constants';
import unlinkFile from '../../../shared/unlinkFile';

const createDoctorToDB = async (payload: IDoctor) => {
  try {
    const isExistDoctor = await Doctor.findOne({ email: payload.email });
    if (isExistDoctor) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'A doctor with this email already exists!');
    }

    const result = await Doctor.create(payload);
    return result;
  } catch (error) {
    if (payload.image) {
      unlinkFile(payload.image)
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, error as string)
  }
};

const getAllDoctorsFromDB = async (query: Record<string, unknown>) => {
  const doctorQuery = new QueryBuilder(Doctor.find(), query)
    .search(doctorSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await doctorQuery.modelQuery;
  const pagination = await doctorQuery.getPaginationInfo();

  return {
    data,
    pagination,
  };
};

const getDoctorByIdFromDB = async (id: string) => {
  const result = await Doctor.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  }

  // Also include the count of patients
  const patientCount = await Patient.countDocuments({ doctor: id });

  return {
    ...result.toObject(),
    patientCount,
  };
};

const updateDoctorToDB = async (id: string, payload: Partial<IDoctor>) => {
  try {
    const isExist = await Doctor.findById(id);
    if (!isExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
    }

    if (payload.email && payload.email !== isExist.email) {
      const isEmailTaken = await Doctor.findOne({ email: payload.email });
      if (isEmailTaken) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already in use by another doctor!');
      }
    }
    if (payload.image && payload.image !== isExist.image) {
      if (isExist.image) {
        unlinkFile(isExist.image)
      }
    }

    const result = await Doctor.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    return result;
  } catch (error) {
    if (payload.image) {
      unlinkFile(payload.image)
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, error as string)
  }
};

const deleteDoctorFromDB = async (id: string) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  }
  if (doctor && doctor.image) {
    unlinkFile(doctor.image);
  }

  // Delete doctor and also unlink images of associated patients
  const patients = await Patient.find({ doctor: id });
  for (const patient of patients) {
    if (patient.image) {
      unlinkFile(patient.image);
    }
  }

  const result = await Doctor.findByIdAndDelete(id);
  await Patient.deleteMany({ doctor: id });

  return result;
};

// View corresponding patients for a specific doctor (with search and pagination)
const getDoctorPatientsFromDB = async (
  doctorId: string,
  query: Record<string, unknown>
) => {
  const isDoctorExist = await Doctor.findById(doctorId);
  if (!isDoctorExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  }

  const patientQuery = new QueryBuilder(Patient.find({ doctor: doctorId }), query)
    .search(patientSearchableFields)
    .filter(['doctor'])
    .sort()
    .paginate()
    .fields();

  const data = await patientQuery.modelQuery;
  const pagination = await patientQuery.getPaginationInfo();

  return {
    doctor: isDoctorExist,
    data,
    pagination,
  };
};

// Add new patient under a specific doctor
const addPatientToDoctorInDB = async (
  doctorId: string,
  payload: Omit<IPatient, 'doctor'>
) => {
  try {
    const isDoctorExist = await Doctor.findById(doctorId);
    if (!isDoctorExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
    }

    const newPatientData = {
      ...payload,
      doctor: doctorId,
    };

    const result = await (
      await Patient.create(newPatientData)
    ).populate('doctor', 'name specialization hospital email phone');

    return result;
  } catch (error) {
    if (payload.image) {
      unlinkFile(payload.image);
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, error as string);
  }
};

// Delete patient from doctor's patient list
const removePatientFromDoctorInDB = async (
  doctorId: string,
  patientId: string
) => {
  const isDoctorExist = await Doctor.findById(doctorId);
  if (!isDoctorExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  }

  const patient = await Patient.findOne({ _id: patientId, doctor: doctorId });
  if (!patient) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Patient not found under this specific doctor'
    );
  }

  if (patient.image) {
    unlinkFile(patient.image);
  }

  const result = await Patient.findByIdAndDelete(patientId);
  return result;
};

export const DoctorService = {
  createDoctorToDB,
  getAllDoctorsFromDB,
  getDoctorByIdFromDB,
  updateDoctorToDB,
  deleteDoctorFromDB,
  getDoctorPatientsFromDB,
  addPatientToDoctorInDB,
  removePatientFromDoctorInDB,
};

