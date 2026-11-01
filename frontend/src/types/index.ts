export interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  experience?: number;
  image?: string;
  patientCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPatient {
  _id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  email?: string;
  address?: string;
  condition: string;
  doctor: IDoctor | string;
  admissionDate: string;
  status: "active" | "under-treatment" | "recovered" | "critical";
  notes?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDashboardAnalytics {
  totalDoctors: number;
  totalPatients: number;
  totalSpecializations: number;
  patientsPerDoctor: {
    _id: string;
    doctorId: string;
    doctorName: string;
    specialization: string;
    hospital: string;
    patientCount: number;
  }[];
  dateBasedStats: {
    date: string;
    patients: number;
    doctors: number;
  }[];
  specializationDistribution: {
    specialization: string;
    count: number;
  }[];
  conditionDistribution: {
    condition: string;
    count: number;
  }[];
  patientStatusDistribution: {
    status: string;
    count: number;
  }[];
  recentDoctors: IDoctor[];
  recentPatients: IPatient[];
}

export interface DoctorQueryParams {
  searchTerm?: string;
  specialization?: string;
  hospital?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number | string;
  limit?: number | string;
  sort?: string;
}

export interface PatientQueryParams {
  searchTerm?: string;
  condition?: string;
  status?: string;
  gender?: string;
  doctor?: string;
  startDate?: string;
  endDate?: string;
  page?: number | string;
  limit?: number | string;
  sort?: string;
}

export interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

