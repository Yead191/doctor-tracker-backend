export type IDashboardAnalytics = {
  totalDoctors: number;
  totalPatients: number;
  totalSpecializations: number;
  patientsPerDoctor: {
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
  recentDoctors: any[];
  recentPatients: any[];
};

