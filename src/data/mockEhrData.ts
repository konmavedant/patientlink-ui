
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
  }
];

// Mock Medical Records for Jane Doe
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
    }
  ],
  'p3': [],
  'p4': [],
  'p5': []
};

// Mock Access Permissions
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
    }
  ],
  'p3': [],
  'p4': [],
  'p5': []
};

// Mock Audit Logs
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
      details: 'Viewed own medical records'
    },
    {
      id: 'log7',
      timestamp: '2023-05-05T14:00:00',
      action: 'create',
      performedBy: {
        id: 'doc3',
        name: 'Dr. Olivia Brown',
        role: 'provider'
      },
      recordId: 'rec5',
      recordType: 'vaccination',
      patientId: 'p1',
      details: 'Recorded COVID-19 vaccination'
    }
  ],
  'p2': [
    {
      id: 'log8',
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
      id: 'log9',
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
  'p3': [],
  'p4': [],
  'p5': []
};

// Mock Notifications
export const mockNotifications: Record<string, Notification[]> = {
  'p1': [
    {
      id: 'notif1',
      userId: 'p1',
      title: 'Access Request',
      message: 'Dr. Olivia Brown has requested access to your medical records',
      date: '2023-05-01T16:10:00',
      read: false,
      type: 'access',
      relatedId: 'acc3'
    },
    {
      id: 'notif2',
      userId: 'p1',
      title: 'New Record Added',
      message: 'Dr. Elizabeth Chen has added a lab result to your records',
      date: '2023-04-23T09:15:00',
      read: true,
      type: 'update',
      relatedId: 'rec4'
    },
    {
      id: 'notif3',
      userId: 'p1',
      title: 'Prescription Reminder',
      message: 'Refill your migraine medication (Sumatriptan) soon',
      date: '2023-05-10T08:00:00',
      read: false,
      type: 'alert',
      relatedId: 'rec3'
    }
  ],
  'p2': [
    {
      id: 'notif4',
      userId: 'p2',
      title: 'Follow-up Appointment',
      message: 'You have a follow-up appointment with Dr. Elizabeth Chen next week',
      date: '2023-05-03T10:30:00',
      read: false,
      type: 'info'
    }
  ],
  'doc1': [
    {
      id: 'notif5',
      userId: 'doc1',
      title: 'Records Updated',
      message: 'You\'ve been granted access to John Smith\'s medical records',
      date: '2023-01-03T15:45:00',
      read: true,
      type: 'access',
      relatedId: 'acc4'
    }
  ],
  'doc2': [
    {
      id: 'notif6',
      userId: 'doc2',
      title: 'Access Granted',
      message: 'You\'ve been granted access to Jane Doe\'s medical records',
      date: '2023-03-09T09:45:00',
      read: true,
      type: 'access',
      relatedId: 'acc2'
    }
  ],
  'doc3': [
    {
      id: 'notif7',
      userId: 'doc3',
      title: 'Access Request Pending',
      message: 'Your request to access Jane Doe\'s records is awaiting approval',
      date: '2023-05-01T16:10:00',
      read: false,
      type: 'access',
      relatedId: 'acc3'
    }
  ]
};

// Current user (for demo purposes, switch between different users)
export const currentUser = {
  id: 'p1',
  name: 'Jane Doe',
  role: 'patient'
};

// Helper function to get user by ID
export function getUserById(id: string) {
  const allUsers = [...mockPatients, ...mockProviders];
  return allUsers.find(user => user.id === id);
}

// Helper function to get patient by ID
export function getPatientById(id: string) {
  return mockPatients.find(patient => patient.id === id);
}

// Helper function to get provider by ID
export function getProviderById(id: string) {
  return mockProviders.find(provider => provider.id === id);
}

// Helper function to get records by patient ID
export function getRecordsByPatientId(patientId: string) {
  return mockMedicalRecords[patientId] || [];
}

// Helper function to get access permissions by patient ID
export function getAccessPermissionsByPatientId(patientId: string) {
  return mockAccessPermissions[patientId] || [];
}

// Helper function to get audit logs by patient ID
export function getAuditLogsByPatientId(patientId: string) {
  return mockAuditLogs[patientId] || [];
}

// Helper function to get notifications by user ID
export function getNotificationsByUserId(userId: string) {
  return mockNotifications[userId] || [];
}
