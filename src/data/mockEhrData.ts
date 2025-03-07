
import { 
  Patient, 
  Provider, 
  MedicalRecord, 
  AccessPermission, 
  AuditLogEntry,
  Notification
} from '@/types/ehr';

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'patient',
    dateOfBirth: '1988-04-12',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    insuranceProvider: 'BlueCross Health',
    emergencyContact: {
      name: 'John Doe',
      relationship: 'Spouse',
      phone: '(555) 123-4567'
    }
  },
  {
    id: 'p2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'patient',
    dateOfBirth: '1975-09-23',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    bloodType: 'A-',
    allergies: ['Sulfa'],
    insuranceProvider: 'Medicare Plus'
  },
  {
    id: 'p3',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    role: 'patient',
    dateOfBirth: '1992-07-15',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    bloodType: 'B+',
    insuranceProvider: 'National Health'
  },
  {
    id: 'p4',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    role: 'patient',
    dateOfBirth: '1980-12-03',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
    bloodType: 'AB+',
    allergies: ['Latex', 'Ibuprofen'],
    insuranceProvider: 'HealthFirst'
  },
  {
    id: 'p5',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    role: 'patient',
    dateOfBirth: '1995-02-28',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    bloodType: 'O-',
    insuranceProvider: 'United Healthcare'
  },
  // Additional patient data
  {
    id: 'p6',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    role: 'patient',
    dateOfBirth: '1990-06-15',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    bloodType: 'A+',
    allergies: ['Aspirin', 'Shellfish'],
    insuranceProvider: 'Pacific Care'
  },
  {
    id: 'p7',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    role: 'patient',
    dateOfBirth: '1983-11-22',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
    bloodType: 'O+',
    insuranceProvider: 'State Health'
  },
  {
    id: 'p8',
    name: 'David Kim',
    email: 'david.k@example.com',
    role: 'patient',
    dateOfBirth: '1978-03-17',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    bloodType: 'B-',
    allergies: ['Dairy'],
    insuranceProvider: 'Golden Insurance'
  },
  {
    id: 'p9',
    name: 'Sophia Patel',
    email: 'sophia.p@example.com',
    role: 'patient',
    dateOfBirth: '1994-09-05',
    avatarUrl: 'https://i.pravatar.cc/150?img=17',
    bloodType: 'AB-',
    insuranceProvider: 'Health Alliance'
  },
  {
    id: 'p10',
    name: 'James Wilson',
    email: 'james.w@example.com',
    role: 'patient',
    dateOfBirth: '1965-12-30',
    avatarUrl: 'https://i.pravatar.cc/150?img=19',
    bloodType: 'O-',
    allergies: ['Nuts', 'Penicillin'],
    insuranceProvider: 'Senior Care Plus'
  },
  {
    id: 'p11',
    name: 'Emma Thompson',
    email: 'emma.t@example.com',
    role: 'patient',
    dateOfBirth: '1998-05-11',
    avatarUrl: 'https://i.pravatar.cc/150?img=21',
    bloodType: 'A+',
    insuranceProvider: 'Young Adult Coverage'
  },
  {
    id: 'p12',
    name: 'Alexander Davis',
    email: 'alex.d@example.com',
    role: 'patient',
    dateOfBirth: '1972-08-19',
    avatarUrl: 'https://i.pravatar.cc/150?img=23',
    bloodType: 'B+',
    allergies: ['Sulfa', 'Dust'],
    insuranceProvider: 'Family Health Plan'
  },
  {
    id: 'p13',
    name: 'Olivia Martin',
    email: 'olivia.m@example.com',
    role: 'patient',
    dateOfBirth: '1989-10-03',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    bloodType: 'AB+',
    insuranceProvider: 'Universal Coverage'
  },
  {
    id: 'p14',
    name: 'William Lee',
    email: 'william.l@example.com',
    role: 'patient',
    dateOfBirth: '1985-01-23',
    avatarUrl: 'https://i.pravatar.cc/150?img=27',
    bloodType: 'O+',
    allergies: ['Eggs', 'Pollen'],
    insuranceProvider: 'Premium Health'
  },
  {
    id: 'p15',
    name: 'Isabella Garcia',
    email: 'isabella.g@example.com',
    role: 'patient',
    dateOfBirth: '1997-07-08',
    avatarUrl: 'https://i.pravatar.cc/150?img=29',
    bloodType: 'A-',
    insuranceProvider: 'Student Health Plan'
  }
];

// Mock Providers
export const mockProviders: Provider[] = [
  {
    id: 'doc1',
    name: 'Dr. Elizabeth Chen',
    email: 'dr.chen@hospital.com',
    role: 'provider',
    specialty: 'Cardiology',
    license: 'MD12345',
    hospital: 'Central Hospital',
    avatarUrl: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 'doc2',
    name: 'Dr. James Wilson',
    email: 'dr.wilson@hospital.com',
    role: 'provider',
    specialty: 'Neurology',
    license: 'MD67890',
    hospital: 'Medical Center',
    avatarUrl: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: 'doc3',
    name: 'Dr. Olivia Brown',
    email: 'dr.brown@clinic.com',
    role: 'provider',
    specialty: 'Pediatrics',
    license: 'MD54321',
    hospital: 'Children\'s Hospital',
    avatarUrl: 'https://i.pravatar.cc/150?img=6'
  },
  // Additional provider data
  {
    id: 'doc4',
    name: 'Dr. Michael Rodriguez',
    email: 'dr.rodriguez@hospital.com',
    role: 'provider',
    specialty: 'Orthopedics',
    license: 'MD98765',
    hospital: 'Central Hospital',
    avatarUrl: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: 'doc5',
    name: 'Dr. Sarah Johnson',
    email: 'dr.johnson@clinic.com',
    role: 'provider',
    specialty: 'Dermatology',
    license: 'MD24680',
    hospital: 'Skin & Health Clinic',
    avatarUrl: 'https://i.pravatar.cc/150?img=10'
  },
  {
    id: 'doc6',
    name: 'Dr. David Park',
    email: 'dr.park@hospital.com',
    role: 'provider',
    specialty: 'Gastroenterology',
    license: 'MD13579',
    hospital: 'Medical Center',
    avatarUrl: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 'doc7',
    name: 'Dr. Emily White',
    email: 'dr.white@childrens.com',
    role: 'provider',
    specialty: 'Pediatric Cardiology',
    license: 'MD97531',
    hospital: 'Children\'s Hospital',
    avatarUrl: 'https://i.pravatar.cc/150?img=14'
  },
  {
    id: 'doc8',
    name: 'Dr. Robert Kim',
    email: 'dr.kim@hospital.com',
    role: 'provider',
    specialty: 'Oncology',
    license: 'MD86420',
    hospital: 'Cancer Treatment Center',
    avatarUrl: 'https://i.pravatar.cc/150?img=16'
  },
  {
    id: 'doc9',
    name: 'Dr. Jennifer Martinez',
    email: 'dr.martinez@hospital.com',
    role: 'provider',
    specialty: 'Obstetrics & Gynecology',
    license: 'MD75319',
    hospital: 'Women\'s Health Clinic',
    avatarUrl: 'https://i.pravatar.cc/150?img=18'
  },
  {
    id: 'doc10',
    name: 'Dr. Thomas Lee',
    email: 'dr.lee@hospital.com',
    role: 'provider',
    specialty: 'Endocrinology',
    license: 'MD24689',
    hospital: 'Diabetes & Hormone Center',
    avatarUrl: 'https://i.pravatar.cc/150?img=20'
  }
];

// Expand mock records to include data for more patients
export const mockMedicalRecords: Record<string, MedicalRecord[]> = {
  'p1': [
    {
      id: 'rec1',
      patientId: 'p1',
      providerId: 'doc1',
      providerName: 'Dr. Elizabeth Chen',
      type: 'visit',
      title: 'Annual Physical Examination',
      date: '2023-02-15T09:30:00',
      description: 'Routine check-up with normal results. Blood pressure and cholesterol levels within normal range.',
      details: {
        bloodPressure: '120/80',
        heartRate: '72 bpm',
        temperature: '98.6°F',
        weight: '145 lbs',
        height: '5\'7"'
      },
      blockchainHash: '0x7fb3520fe7d9c5c60c75af8d8f79f8c82e4b74c6',
      lastModified: '2023-02-15T10:45:00'
    },
    {
      id: 'rec2',
      patientId: 'p1',
      providerId: 'doc2',
      providerName: 'Dr. James Wilson',
      type: 'diagnosis',
      title: 'Migraine Diagnosis',
      date: '2023-03-10T14:15:00',
      description: 'Patient reports recurring headaches. Diagnosed with migraine and recommended treatment.',
      details: {
        symptoms: 'Throbbing pain, sensitivity to light and sound',
        duration: '2-3 days',
        frequency: '2-3 times per month',
        triggers: 'Stress, lack of sleep',
        severity: 'Moderate to severe'
      },
      blockchainHash: '0x3ac9d826be4f23f9a02213f68bf34598be70d0fa',
      lastModified: '2023-03-10T15:30:00'
    },
    {
      id: 'rec3',
      patientId: 'p1',
      providerId: 'doc2',
      providerName: 'Dr. James Wilson',
      type: 'prescription',
      title: 'Migraine Medication',
      date: '2023-03-10T15:30:00',
      description: 'Prescribed sumatriptan for acute migraine attacks and propranolol for prevention.',
      details: {
        medications: [
          {
            name: 'Sumatriptan',
            dosage: '50mg',
            frequency: 'As needed for migraine attacks, not to exceed 200mg in 24 hours',
            duration: '3 months'
          },
          {
            name: 'Propranolol',
            dosage: '40mg',
            frequency: 'Once daily',
            duration: '3 months'
          }
        ],
        refills: 2
      },
      blockchainHash: '0x6c872ea3ba11e20a3d6128f686333bdd432cd73e',
      lastModified: '2023-03-10T15:45:00'
    },
    {
      id: 'rec4',
      patientId: 'p1',
      providerId: 'doc1',
      providerName: 'Dr. Elizabeth Chen',
      type: 'lab',
      title: 'Complete Blood Count',
      date: '2023-04-22T11:00:00',
      description: 'Routine blood work shows all values within normal ranges.',
      details: {
        wbc: '7.2 K/uL',
        rbc: '4.8 M/uL',
        hemoglobin: '14.1 g/dL',
        hematocrit: '42%',
        platelets: '250 K/uL'
      },
      attachments: [
        {
          name: 'CBC Results',
          url: '/mock-attachments/cbc-results.pdf',
          type: 'application/pdf'
        }
      ],
      blockchainHash: '0x2f689a78a9e432f0eb818f4dda66bf71a9fb6ee9',
      lastModified: '2023-04-23T09:15:00'
    },
    {
      id: 'rec5',
      patientId: 'p1',
      providerId: 'doc3',
      providerName: 'Dr. Olivia Brown',
      type: 'vaccination',
      title: 'COVID-19 Vaccination',
      date: '2023-05-05T13:45:00',
      description: 'Patient received Pfizer-BioNTech COVID-19 vaccine (second dose).',
      details: {
        vaccine: 'Pfizer-BioNTech COVID-19',
        lotNumber: 'EW0182',
        dose: '2nd dose',
        site: 'Left arm'
      },
      blockchainHash: '0x1c59e8b7cd3c0cba793c4f4df7ca5bbb9c9c1b9a',
      lastModified: '2023-05-05T14:00:00'
    }
  ],
  'p2': [
    {
      id: 'rec6',
      patientId: 'p2',
      providerId: 'doc1',
      providerName: 'Dr. Elizabeth Chen',
      type: 'visit',
      title: 'Wellness Check',
      date: '2023-01-10T10:00:00',
      description: 'Annual wellness check with focus on cardiovascular health.',
      details: {
        bloodPressure: '135/85',
        heartRate: '78 bpm',
        temperature: '98.4°F',
        weight: '182 lbs',
        height: '5\'10"'
      },
      blockchainHash: '0x4a9c8e7f1d3b2c5a6f9e8d7c6b5a4f3e2d1c0b9a',
      lastModified: '2023-01-10T11:15:00'
    },
    {
      id: 'rec7',
      patientId: 'p2',
      providerId: 'doc2',
      providerName: 'Dr. James Wilson',
      type: 'lab',
      title: 'Cholesterol Panel',
      date: '2023-02-15T09:00:00',
      description: 'Patient shows slightly elevated LDL levels. Recommended dietary changes.',
      details: {
        totalCholesterol: '210 mg/dL',
        ldl: '140 mg/dL',
        hdl: '45 mg/dL',
        triglycerides: '150 mg/dL'
      },
      blockchainHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      lastModified: '2023-02-15T10:30:00'
    }
  ],
  'p3': [
    {
      id: 'rec8',
      patientId: 'p3',
      providerId: 'doc3',
      providerName: 'Dr. Olivia Brown',
      type: 'visit',
      title: 'Annual Check-up',
      date: '2023-03-22T14:00:00',
      description: 'Routine examination with all parameters normal.',
      details: {
        bloodPressure: '118/75',
        heartRate: '68 bpm',
        temperature: '98.2°F',
        weight: '130 lbs',
        height: '5\'5"'
      },
      blockchainHash: '0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
      lastModified: '2023-03-22T15:15:00'
    }
  ],
  'p4': [
    {
      id: 'rec9',
      patientId: 'p4',
      providerId: 'doc4',
      providerName: 'Dr. Michael Rodriguez',
      type: 'diagnosis',
      title: 'Knee Injury Assessment',
      date: '2023-04-10T11:30:00',
      description: 'Patient presents with right knee pain after sports injury. MRI ordered.',
      details: {
        symptoms: 'Swelling, pain with movement, limited range of motion',
        duration: '5 days',
        severity: 'Moderate',
        preliminaryDiagnosis: 'Suspected meniscus tear'
      },
      blockchainHash: '0x9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t',
      lastModified: '2023-04-10T12:45:00'
    },
    {
      id: 'rec10',
      patientId: 'p4',
      providerId: 'doc4',
      providerName: 'Dr. Michael Rodriguez',
      type: 'imaging',
      title: 'Right Knee MRI',
      date: '2023-04-17T09:00:00',
      description: 'MRI confirms partial tear of the medial meniscus.',
      details: {
        findings: 'Grade II tear of the right medial meniscus',
        recommendations: 'Physical therapy, rest, anti-inflammatory medication'
      },
      blockchainHash: '0xz1x2c3v4b5n6m7a8s9d0f1g2h3j4k5l6z7x8c9v0',
      lastModified: '2023-04-17T11:00:00'
    }
  ],
  'p5': [
    {
      id: 'rec11',
      patientId: 'p5',
      providerId: 'doc5',
      providerName: 'Dr. Sarah Johnson',
      type: 'visit',
      title: 'Dermatology Consultation',
      date: '2023-03-15T13:00:00',
      description: 'Patient presents with skin rash on arms and torso.',
      details: {
        symptoms: 'Itchy red rash, small bumps',
        duration: '2 weeks',
        triggers: 'Unknown, possibly new detergent'
      },
      blockchainHash: '0xd1f2g3h4j5k6l7z8x9c0v1b2n3m4a5s6d7f8g9h0',
      lastModified: '2023-03-15T14:00:00'
    },
    {
      id: 'rec12',
      patientId: 'p5',
      providerId: 'doc5',
      providerName: 'Dr. Sarah Johnson',
      type: 'prescription',
      title: 'Topical Corticosteroid',
      date: '2023-03-15T14:00:00',
      description: 'Prescribed treatment for contact dermatitis.',
      details: {
        medications: [
          {
            name: 'Hydrocortisone 1%',
            dosage: 'Apply thin layer to affected areas',
            frequency: 'Twice daily',
            duration: '2 weeks'
          },
          {
            name: 'Cetirizine',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '2 weeks'
          }
        ],
        refills: 1
      },
      blockchainHash: '0xh1j2k3l4z5x6c7v8b9n0m1a2s3d4f5g6h7j8k9l0',
      lastModified: '2023-03-15T14:10:00'
    }
  ],
  'p6': [
    {
      id: 'rec13',
      patientId: 'p6',
      providerId: 'doc6',
      providerName: 'Dr. David Park',
      type: 'visit',
      title: 'Gastroenterology Consultation',
      date: '2023-05-05T10:30:00',
      description: 'Patient reports recurring abdominal pain and acid reflux.',
      details: {
        symptoms: 'Heartburn, regurgitation, upper abdominal pain',
        duration: '3 months, worsening',
        triggers: 'Spicy foods, lying down after meals'
      },
      blockchainHash: '0xk1l2z3x4c5v6b7n8m9a0s1d2f3g4h5j6k7l8z9x0',
      lastModified: '2023-05-05T11:45:00'
    }
  ],
  'p7': [],
  'p8': [],
  'p9': [],
  'p10': [],
  'p11': [],
  'p12': [],
  'p13': [],
  'p14': [],
  'p15': []
};

// Expand access permissions to include more patients
export const mockAccessPermissions: Record<string, AccessPermission[]> = {
  'p1': [
    {
      id: 'acc1',
      patientId: 'p1',
      providerId: 'doc1',
      providerName: 'Dr. Elizabeth Chen',
      providerSpecialty: 'Cardiology',
      status: 'granted',
      dateRequested: '2023-01-05T08:30:00',
      dateModified: '2023-01-05T10:15:00',
      expirationDate: '2024-01-05T00:00:00'
    },
    {
      id: 'acc2',
      patientId: 'p1',
      providerId: 'doc2',
      providerName: 'Dr. James Wilson',
      providerSpecialty: 'Neurology',
      status: 'granted',
      dateRequested: '2023-03-08T14:20:00',
      dateModified: '2023-03-09T09:45:00',
      expirationDate: '2023-09-09T00:00:00'
    },
    {
      id: 'acc3',
      patientId: 'p1',
      providerId: 'doc3',
      providerName: 'Dr. Olivia Brown',
      providerSpecialty: 'Pediatrics',
      status: 'pending',
      dateRequested: '2023-05-01T16:10:00'
    }
  ],
  'p2': [
    {
      id: 'acc4',
      patientId: 'p2',
      providerId: 'doc1',
      providerName: 'Dr. Elizabeth Chen',
      providerSpecialty: 'Cardiology',
      status: 'granted',
      dateRequested: '2023-01-03T11:20:00',
      dateModified: '2023-01-03T15:45:00',
      expirationDate: '2024-01-03T00:00:00'
    },
    {
      id: 'acc5',
      patientId: 'p2',
      providerId: 'doc2',
      providerName: 'Dr. James Wilson',
      providerSpecialty: 'Neurology',
      status: 'granted',
      dateRequested: '2023-02-01T09:20:00',
      dateModified: '2023-02-01T10:45:00',
      expirationDate: '2024-02-01T00:00:00'
    }
  ],
  'p3': [
    {
      id: 'acc6',
      patientId: 'p3',
      providerId: 'doc3',
      providerName: 'Dr. Olivia Brown',
      providerSpecialty: 'Pediatrics',
      status: 'granted',
      dateRequested: '2023-03-20T13:10:00',
      dateModified: '2023-03-20T14:25:00',
      expirationDate: '2023-09-20T00:00:00'
    }
  ],
  'p4': [
    {
      id: 'acc7',
      patientId: 'p4',
      providerId: 'doc4',
      providerName: 'Dr. Michael Rodriguez',
      providerSpecialty: 'Orthopedics',
      status: 'granted',
      dateRequested: '2023-04-05T10:40:00',
      dateModified: '2023-04-05T11:15:00',
      expirationDate: '2023-10-05T00:00:00'
    },
    {
      id: 'acc8',
      patientId: 'p4',
      providerId: 'doc2',
      providerName: 'Dr. James Wilson',
      providerSpecialty: 'Neurology',
      status: 'pending',
      dateRequested: '2023-05-12T14:30:00'
    }
  ],
  'p5': [
    {
      id: 'acc9',
      patientId: 'p5',
      providerId: 'doc5',
      providerName: 'Dr. Sarah Johnson',
      providerSpecialty: 'Dermatology',
      status: 'granted',
      dateRequested: '2023-03-10T09:15:00',
      dateModified: '2023-03-10T10:20:00',
      expirationDate: '2023-09-10T00:00:00'
    }
  ],
  'p6': [
    {
      id: 'acc10',
      patientId: 'p6',
      providerId: 'doc6',
      providerName: 'Dr. David Park',
      providerSpecialty: 'Gastroenterology',
      status: 'granted',
      dateRequested: '2023-05-01T15:40:00',
      dateModified: '2023-05-01T16:50:00',
      expirationDate: '2023-11-01T00:00:00'
    }
  ],
  'p7': [],
  'p8': [],
  'p9': [],
  'p10': [],
  'p11': [],
  'p12': [],
  'p13': [],
  'p14': [],
  'p15': []
};

// Expand audit logs for more patients
export const mockAuditLogs: Record<string, AuditLogEntry[]> = {
  'p1': [
    {
      id: 'log1',
      timestamp: '2023-02-15T10:45:00',
      action: 'create',
      performedBy: {
        id: 'doc1',
        name: 'Dr. Elizabeth Chen',
        role: 'provider'
      },
      recordId: 'rec1',
      recordType: 'visit',
      patientId: 'p1',
      details: 'Created annual physical examination record'
    },
    {
      id: 'log2',
      timestamp: '2023-03-09T09:45:00',
      action: 'grant',
      performedBy: {
        id: 'p1',
        name: 'Jane Doe',
        role: 'patient'
      },
      patientId: 'p1',
      details: 'Granted access to Dr. James Wilson'
    },
    {
      id: 'log3',
      timestamp: '2023-03-10T15:45:00',
      action: 'create',
      performedBy: {
        id: 'doc2',
        name: 'Dr. James Wilson',
        role: 'provider'
      },
      recordId: 'rec2',
      recordType: 'diagnosis',
      patientId: 'p1',
      details: 'Created migraine diagnosis record'
    },
    {
      id: 'log4',
      timestamp: '2023-03-10T15:50:00',
      action: 'create',
      performedBy: {
        id: 'doc2',
        name: 'Dr. James Wilson',
        role: 'provider'
      },
      recordId: 'rec3',
      recordType: 'prescription',
      patientId: 'p1',
      details: 'Created prescription for migraine medication'
    },
    {
      id: 'log5',
      timestamp: '2023-04-23T09:15:00',
      action: 'create',
      performedBy: {
        id: 'doc1',
        name: 'Dr. Elizabeth Chen',
        role: 'provider'
      },
      recordId: 'rec4',
      recordType: 'lab',
      patientId: 'p1',
      details: 'Added complete blood count results'
    },
    {
      id: 'log6',
      timestamp: '2023-05-01T16:15:00',
      action: 'view',
      performedBy: {
        id: 'p1',
        name: 'Jane Doe',
        role: 'patient'
      },
      patientId: 'p1',
      details: 'Viewed all medical records'
    }
  ],
  'p2': [
    {
      id: 'log7',
      timestamp: '2023-01-03T15:45:00',
      action: 'grant',
      performedBy: {
        id: 'p2',
        name: 'John Smith',
        role: 'patient'
      },
      patientId: 'p2',
      details: 'Granted access to Dr. Elizabeth Chen'
    },
    {
      id: 'log8',
      timestamp: '2023-01-10T11:15:00',
      action: 'create',
      performedBy: {
        id: 'doc1',
        name: 'Dr. Elizabeth Chen',
        role: 'provider'
      },
      recordId: 'rec6',
      recordType: 'visit',
      patientId: 'p2',
      details: 'Created wellness check record'
    }
  ],
  'p3': [
    {
      id: 'log9',
      timestamp: '2023-03-20T14:25:00',
      action: 'grant',
      performedBy: {
        id: 'p3',
        name: 'Maria Garcia',
        role: 'patient'
      },
      patientId: 'p3',
      details: 'Granted access to Dr. Olivia Brown'
    }
  ],
  'p4': [],
  'p5': [],
  'p6': []
};

// Add helper functions to get data more easily
export const getMedicalRecordsByPatientId = (patientId: string): MedicalRecord[] => {
  return mockMedicalRecords[patientId] || [];
};

export const getAccessPermissionsByPatientId = (patientId: string): AccessPermission[] => {
  return mockAccessPermissions[patientId] || [];
};

export const getAuditLogsByPatientId = (patientId: string): AuditLogEntry[] => {
  return mockAuditLogs[patientId] || [];
};

export const getPatientById = (patientId: string): Patient | undefined => {
  return mockPatients.find(patient => patient.id === patientId);
};

export const getProviderById = (providerId: string): Provider | undefined => {
  return mockProviders.find(provider => provider.id === providerId);
};

// For backward compatibility - alias for getMedicalRecordsByPatientId
export const getRecordsByPatientId = getMedicalRecordsByPatientId;

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'p1',
    title: 'New Medical Record',
    message: 'Dr. Elizabeth Chen added a new lab result to your records.',
    date: '2023-04-23T09:30:00',
    read: false,
    type: 'update',
    relatedId: 'rec4'
  },
  {
    id: 'notif2',
    userId: 'p1',
    title: 'Access Request',
    message: 'Dr. Olivia Brown has requested access to your medical records.',
    date: '2023-05-01T16:10:00',
    read: false,
    type: 'access',
    relatedId: 'acc3'
  },
  {
    id: 'notif3',
    userId: 'doc1',
    title: 'New Patient',
    message: 'You have been granted access to John Smith\'s medical records.',
    date: '2023-01-03T15:45:00',
    read: true,
    type: 'access',
    relatedId: 'acc4'
  },
  {
    id: 'notif4',
    userId: 'p2',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Elizabeth Chen tomorrow at 10:00 AM.',
    date: '2023-03-14T08:00:00',
    read: true,
    type: 'info'
  },
  {
    id: 'notif5',
    userId: 'p4',
    title: 'Appointment Scheduled',
    message: 'MRI appointment confirmed for April 17 at 9:00 AM at Medical Imaging Center.',
    date: '2023-04-10T13:30:00',
    read: false,
    type: 'info'
  }
];

export const getNotificationsByUserId = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => notification.userId === userId);
};
