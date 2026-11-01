import { Doctor } from '../app/modules/doctor/doctor.model';
import { Patient } from '../app/modules/patient/patient.model';
import { logger } from '../shared/logger';

const sampleDoctors = [
  {
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    hospital: 'Metropolitan General Hospital',
    phone: '+1 555-0101',
    email: 'sarah.jenkins@metropolitan.org',
    status: 'active' as const,
    experience: 12,
  },
  {
    name: 'Dr. Michael Chen',
    specialization: 'Neurology',
    hospital: 'Cityview Health Center',
    phone: '+1 555-0102',
    email: 'michael.chen@cityviewhealth.org',
    status: 'active' as const,
    experience: 15,
  },
  {
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrics',
    hospital: "St. Jude Children's Clinic",
    phone: '+1 555-0103',
    email: 'emily.rodriguez@stjudeclinic.org',
    status: 'active' as const,
    experience: 8,
  },
  {
    name: 'Dr. James Wilson',
    specialization: 'Orthopedics',
    hospital: 'Apex Medical Institute',
    phone: '+1 555-0104',
    email: 'james.wilson@apexmedical.org',
    status: 'active' as const,
    experience: 14,
  },
  {
    name: 'Dr. Aisha Patel',
    specialization: 'Dermatology',
    hospital: 'DermaCare Specialty Hospital',
    phone: '+1 555-0105',
    email: 'aisha.patel@dermacare.org',
    status: 'active' as const,
    experience: 9,
  },
  {
    name: 'Dr. Robert Taylor',
    specialization: 'Oncology',
    hospital: 'Memorial Cancer Center',
    phone: '+1 555-0106',
    email: 'robert.taylor@memorialcancer.org',
    status: 'active' as const,
    experience: 20,
  },
];

export const seedSampleData = async () => {
  const existingDoctors = await Doctor.countDocuments();
  if (existingDoctors > 0) return;

  logger.info('🌱 Seeding initial sample doctors and patients...');
  const createdDoctors = await Doctor.insertMany(sampleDoctors);

  const samplePatients = [
    {
      name: 'John Doe',
      age: 45,
      gender: 'male' as const,
      phone: '+1 555-1111',
      email: 'john.doe@example.com',
      address: '742 Evergreen Terrace, Springfield',
      condition: 'Hypertension',
      doctor: createdDoctors[0]._id,
      admissionDate: new Date(Date.now() - 15 * 86400000),
      status: 'under-treatment' as const,
      notes: 'Blood pressure monitoring twice daily.',
    },
    {
      name: 'Eleanor Vance',
      age: 62,
      gender: 'female' as const,
      phone: '+1 555-2222',
      email: 'eleanor.vance@example.com',
      address: '12 Hill House Lane, Boston',
      condition: 'Coronary Artery Disease',
      doctor: createdDoctors[0]._id,
      admissionDate: new Date(Date.now() - 10 * 86400000),
      status: 'critical' as const,
      notes: 'Scheduled for angiogram check.',
    },
    {
      name: 'David Miller',
      age: 38,
      gender: 'male' as const,
      phone: '+1 555-3333',
      email: 'david.miller@example.com',
      address: '88 Beacon St, Boston',
      condition: 'Migraine',
      doctor: createdDoctors[1]._id,
      admissionDate: new Date(Date.now() - 20 * 86400000),
      status: 'active' as const,
      notes: 'Prescribed triptans, responding well.',
    },
    {
      name: 'Sophia Martinez',
      age: 7,
      gender: 'female' as const,
      phone: '+1 555-4444',
      email: 'parent.martinez@example.com',
      address: '45 Sunset Blvd, Los Angeles',
      condition: 'Asthma',
      doctor: createdDoctors[2]._id,
      admissionDate: new Date(Date.now() - 5 * 86400000),
      status: 'under-treatment' as const,
      notes: 'Inhaler prescribed, allergy test scheduled.',
    },
    {
      name: 'Lucas Brown',
      age: 29,
      gender: 'male' as const,
      phone: '+1 555-5555',
      email: 'lucas.brown@example.com',
      address: '101 Pine Needle Way, Denver',
      condition: 'Tibial Fracture',
      doctor: createdDoctors[3]._id,
      admissionDate: new Date(Date.now() - 30 * 86400000),
      status: 'recovered' as const,
      notes: 'Cast removed, physiotherapy ongoing.',
    },
    {
      name: 'Clara Oswald',
      age: 31,
      gender: 'female' as const,
      phone: '+1 555-6666',
      email: 'clara.oswald@example.com',
      address: '221B Baker St, London',
      condition: 'Eczema',
      doctor: createdDoctors[4]._id,
      admissionDate: new Date(Date.now() - 8 * 86400000),
      status: 'active' as const,
      notes: 'Topical corticosteroid course.',
    },
    {
      name: 'Arthur Dent',
      age: 55,
      gender: 'male' as const,
      phone: '+1 555-7777',
      email: 'arthur.dent@example.com',
      address: '42 Cottington Lane, Cottington',
      condition: 'Lymphoma',
      doctor: createdDoctors[5]._id,
      admissionDate: new Date(Date.now() - 45 * 86400000),
      status: 'under-treatment' as const,
      notes: 'Cycle 3 chemotherapy completed.',
    },
    {
      name: 'Maria Garcia',
      age: 50,
      gender: 'female' as const,
      phone: '+1 555-8888',
      email: 'maria.garcia@example.com',
      address: '15 Ocean Drive, Miami',
      condition: 'Type 2 Diabetes',
      doctor: createdDoctors[0]._id,
      admissionDate: new Date(Date.now() - 12 * 86400000),
      status: 'active' as const,
      notes: 'Metformin 500mg daily, glycemic tracking.',
    },
  ];

  await Patient.insertMany(samplePatients);
  logger.info('✅ Sample doctors and patients seeded successfully!');
};

