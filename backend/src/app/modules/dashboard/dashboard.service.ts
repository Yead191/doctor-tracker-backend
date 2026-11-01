import { Doctor } from '../doctor/doctor.model';
import { Patient } from '../patient/patient.model';

const getDashboardAnalyticsFromDB = async () => {
  // Concurrently fetch counts and aggregate analytics
  const [
    totalDoctors,
    totalPatients,
    distinctSpecializations,
    patientsPerDoctor,
    conditionDistribution,
    specializationDistribution,
    patientStatusDistribution,
    recentDoctors,
    recentPatients,
    patientDateStats,
    doctorDateStats,
  ] = await Promise.all([
    // Total Doctors count
    Doctor.countDocuments(),

    // Total Patients count
    Patient.countDocuments(),

    // Distinct specializations
    Doctor.distinct('specialization'),

    // Patients per Doctor aggregation
    Doctor.aggregate([
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
          foreignField: 'doctor',
          as: 'patients',
        },
      },
      {
        $project: {
          doctorId: '$_id',
          doctorName: '$name',
          specialization: '$specialization',
          hospital: '$hospital',
          patientCount: { $size: '$patients' },
        },
      },
      { $sort: { patientCount: -1 } },
      { $limit: 10 },
    ]),

    // Patient Condition Distribution (for Pie/Bar Charts)
    Patient.aggregate([
      {
        $group: {
          _id: '$condition',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          condition: '$_id',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]),

    // Doctor Specialization Distribution (for Doughnut/Pie Charts)
    Doctor.aggregate([
      {
        $group: {
          _id: '$specialization',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          specialization: '$_id',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]),

    // Patient Status Distribution (active, under-treatment, recovered, critical)
    Patient.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]),

    // Recent 5 Doctors
    Doctor.find().sort({ createdAt: -1 }).limit(5),

    // Recent 5 Patients with populated Doctor info
    Patient.find()
      .populate('doctor', 'name specialization hospital image')
      .sort({ createdAt: -1 })
      .limit(5),

    // Date-based Statistics for Patients (Monthly/Daily)
    Patient.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]),

    // Date-based Statistics for Doctors
    Doctor.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]),
  ]);

  // Merge date-based stats for charts
  const dateMap = new Map<
    string,
    { date: string; patients: number; doctors: number }
  >();

  patientDateStats.forEach(item => {
    dateMap.set(item._id, {
      date: item._id,
      patients: item.count,
      doctors: 0,
    });
  });

  doctorDateStats.forEach(item => {
    if (dateMap.has(item._id)) {
      dateMap.get(item._id)!.doctors = item.count;
    } else {
      dateMap.set(item._id, {
        date: item._id,
        patients: 0,
        doctors: item.count,
      });
    }
  });

  const dateBasedStats = Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return {
    totalDoctors,
    totalPatients,
    totalSpecializations: distinctSpecializations.length,
    patientsPerDoctor,
    dateBasedStats,
    specializationDistribution,
    conditionDistribution,
    patientStatusDistribution,
    recentDoctors,
    recentPatients,
  };
};

export const DashboardService = {
  getDashboardAnalyticsFromDB,
};
