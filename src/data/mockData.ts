
import { 
  User, 
  Patient, 
  Provider, 
  MedicalRecord, 
  AccessPermission, 
  Notification 
} from '../types';

// Helper function to generate dates
const getDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Mock Patients
export const patients: Patient[] = [
  {
    id: 'p1',
    username: 'patient',
    password: 'password',
    type: 'patient',
    name: 'Jane Doe',
    dob: '1988-05-15',
    gender: 'Female',
    bloodType: 'A+',
    address: '123 Patient St, Medical City, MC 12345',
    phone: '(555) 123-4567',
    email: 'jane.doe@example.com',
    emergencyContact: 'John Doe, (555) 987-6543',
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Asthma'],
    profileImage: '/placeholder.svg'
  },
  {
    id: 'p2',
    username: 'john.smith',
    password: 'password',
    type: 'patient',
    name: 'John Smith',
    dob: '1972-09-22',
    gender: 'Male',
    bloodType: 'O-',
    address: '456 Health Ave, Medical City, MC 12345',
    phone: '(555) 234-5678',
    email: 'john.smith@example.com',
    emergencyContact: 'Mary Smith, (555) 876-5432',
    allergies: ['Sulfa drugs'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    profileImage: '/placeholder.svg'
  },
  {
    id: 'p3',
    username: 'emily.johnson',
    password: 'password',
    type: 'patient',
    name: 'Emily Johnson',
    dob: '1995-03-10',
    gender: 'Female',
    bloodType: 'B+',
    address: '789 Wellness Blvd, Medical City, MC 12345',
    phone: '(555) 345-6789',
    email: 'emily.j@example.com',
    emergencyContact: 'David Johnson, (555) 765-4321',
    allergies: [],
    chronicConditions: ['Migraine'],
    profileImage: '/placeholder.svg'
  },
  {
    id: 'p4',
    username: 'michael.brown',
    password: 'password',
    type: 'patient',
    name: 'Michael Brown',
    dob: '1980-11-28',
    gender: 'Male',
    bloodType: 'AB+',
    address: '101 Care Lane, Medical City, MC 12345',
    phone: '(555) 456-7890',
    email: 'michael.b@example.com',
    emergencyContact: 'Sarah Brown, (555) 654-3210',
    allergies: ['Latex', 'Shellfish'],
    chronicConditions: ['Arthritis'],
    profileImage: '/placeholder.svg'
  },
  {
    id: 'p5',
    username: 'sarah.wilson',
    password: 'password',
    type: 'patient',
    name: 'Sarah Wilson',
    dob: '1990-07-04',
    gender: 'Female',
    bloodType: 'A-',
    address: '202 Healing Road, Medical City, MC 12345',
    phone: '(555) 567-8901',
    email: 'sarah.w@example.com',
    emergencyContact: 'Robert Wilson, (555) 543-2109',
    allergies: ['Ibuprofen'],
    chronicConditions: [],
    profileImage: '/placeholder.svg'
  }
];

// Mock Providers
export const providers: Provider[] = [
  {
    id: 'dr1',
    username: 'provider',
    password: 'password',
    type: 'provider',
    name: 'Dr. Robert Smith',
    specialty: 'Cardiology',
    hospitalAffiliation: 'Medical City General Hospital',
    licenseNumber: 'MC123456',
    phone: '(555) 987-6543',
    email: 'dr.smith@hospital.com',
    profileImage: '/placeholder.svg'
  },
  {
    id: 'dr2',
    username: 'dr.johnson',
    password: 'password',
    type: 'provider',
    name: 'Dr. Lisa Johnson',
    specialty: 'Neurology',
    hospitalAffiliation: 'Medical City General Hospital',
    licenseNumber: 'MC789012',
    phone: '(555) 876-5432',
    email: 'dr.johnson@hospital.com',
    profileImage: '/placeholder.svg'
  },
  {
    id: 'dr3',
    username: 'dr.patel',
    password: 'password',
    type: 'provider',
    name: 'Dr. Rajiv Patel',
    specialty: 'Orthopedics',
    hospitalAffiliation: 'Medical City General Hospital',
    licenseNumber: 'MC345678',
    phone: '(555) 765-4321',
    email: 'dr.patel@hospital.com',
    profileImage: '/placeholder.svg'
  }
];

// All users (combined for login)
export const users: User[] = [
  ...patients.map(p => ({ id: p.id, username: p.username, password: p.password, type: p.type })),
  ...providers.map(p => ({ id: p.id, username: p.username, password: p.password, type: p.type }))
];

// Mock Medical Records for Jane Doe (p1)
export const medicalRecords: { [key: string]: MedicalRecord[] } = {
  'p1': [
    {
      id: 'rec1',
      patientId: 'p1',
      date: getDate(2),
      type: 'Consultation',
      provider: 'Dr. Robert Smith',
      providerId: 'dr1',
      diagnosis: 'Seasonal Allergies',
      notes: 'Patient presented with nasal congestion, sneezing, and watery eyes. Prescribed antihistamine and nasal spray.',
      prescription: 'Loratadine 10mg daily, Fluticasone nasal spray',
      attachments: []
    },
    {
      id: 'rec2',
      patientId: 'p1',
      date: getDate(30),
      type: 'Laboratory Test',
      provider: 'Dr. Robert Smith',
      providerId: 'dr1',
      diagnosis: '',
      notes: 'Complete Blood Count (CBC) shows normal values across all parameters. Vitamin D levels slightly low.',
      prescription: 'Vitamin D3 1000 IU daily',
      attachments: ['CBC Results', 'Vitamin Panel']
    },
    {
      id: 'rec3',
      patientId: 'p1',
      date: getDate(90),
      type: 'Vaccination',
      provider: 'Dr. Lisa Johnson',
      providerId: 'dr2',
      diagnosis: '',
      notes: 'Annual flu vaccination administered. No adverse reactions observed during 15-minute wait period.',
      prescription: '',
      attachments: ['Vaccination Record']
    },
    {
      id: 'rec4',
      patientId: 'p1',
      date: getDate(180),
      type: 'Physical Examination',
      provider: 'Dr. Robert Smith',
      providerId: 'dr1',
      diagnosis: 'Healthy',
      notes: 'Annual physical examination. All vital signs normal. Patient reports occasional tension headaches with stress.',
      prescription: 'Recommended stress management techniques and regular exercise',
      attachments: ['Physical Exam Report']
    },
    {
      id: 'rec5',
      patientId: 'p1',
      date: getDate(365),
      type: 'Radiology',
      provider: 'Dr. Rajiv Patel',
      providerId: 'dr3',
      diagnosis: 'Mild osteoarthritis in right knee',
      notes: 'X-ray performed due to persistent right knee pain after running. Shows mild osteoarthritis. Recommended physical therapy.',
      prescription: 'Physical therapy twice weekly for 4 weeks',
      attachments: ['X-ray Report', 'Physical Therapy Referral']
    }
  ],
  'p2': [
    {
      id: 'rec6',
      patientId: 'p2',
      date: getDate(5),
      type: 'Consultation',
      provider: 'Dr. Robert Smith',
      providerId: 'dr1',
      diagnosis: 'Hypertension check',
      notes: 'Blood pressure readings have improved with current medication regimen. 135/85. Continue monitoring.',
      prescription: 'Lisinopril 10mg daily, continue',
      attachments: []
    },
    {
      id: 'rec7',
      patientId: 'p2',
      date: getDate(45),
      type: 'Laboratory Test',
      provider: 'Dr. Robert Smith',
      providerId: 'dr1',
      diagnosis: '',
      notes: 'HbA1c at 6.7%, improved from previous 7.2%. Liver and kidney function normal.',
      prescription: 'Continue current diabetic medication',
      attachments: ['Diabetic Panel', 'Metabolic Panel']
    }
  ],
  'p3': [
    {
      id: 'rec8',
      patientId: 'p3',
      date: getDate(10),
      type: 'Consultation',
      provider: 'Dr. Lisa Johnson',
      providerId: 'dr2',
      diagnosis: 'Migraine with aura',
      notes: 'Patient reports increased frequency of migraines. Discussed triggers and prescribed preventative medication.',
      prescription: 'Propranolol 40mg daily, Sumatriptan 50mg as needed',
      attachments: []
    }
  ],
  'p4': [
    {
      id: 'rec9',
      patientId: 'p4',
      date: getDate(15),
      type: 'Physical Therapy',
      provider: 'Dr. Rajiv Patel',
      providerId: 'dr3',
      diagnosis: 'Knee arthritis management',
      notes: 'Completing final session of physical therapy for knee arthritis. Range of motion improved.',
      prescription: 'Home exercise regimen',
      attachments: ['PT Progress Report']
    }
  ],
  'p5': [
    {
      id: 'rec10',
      patientId: 'p5',
      date: getDate(7),
      type: 'Consultation',
      provider: 'Dr. Lisa Johnson',
      providerId: 'dr2',
      diagnosis: 'Tension headache',
      notes: 'Patient experiencing stress-related tension headaches. Discussed stress management techniques.',
      prescription: 'Acetaminophen as needed',
      attachments: []
    }
  ]
};

// Mock Access Permissions
export const accessPermissions: { [key: string]: AccessPermission[] } = {
  'p1': [
    {
      id: 'acc1',
      patientId: 'p1',
      providerId: 'dr1',
      providerName: 'Dr. Robert Smith',
      providerSpecialty: 'Cardiology',
      granted: true,
      requestDate: getDate(90),
      grantDate: getDate(89),
      expiryDate: getDate(-275), // 9 months in the future
      accessLevel: 'full'
    },
    {
      id: 'acc2',
      patientId: 'p1',
      providerId: 'dr2',
      providerName: 'Dr. Lisa Johnson',
      providerSpecialty: 'Neurology',
      granted: true,
      requestDate: getDate(95),
      grantDate: getDate(94),
      expiryDate: getDate(-5), // 1 day in the future
      accessLevel: 'limited'
    },
    {
      id: 'acc3',
      patientId: 'p1',
      providerId: 'dr3',
      providerName: 'Dr. Rajiv Patel',
      providerSpecialty: 'Orthopedics',
      granted: false,
      requestDate: getDate(2),
      grantDate: null,
      expiryDate: null,
      accessLevel: 'none'
    }
  ],
  'p2': [
    {
      id: 'acc4',
      patientId: 'p2',
      providerId: 'dr1',
      providerName: 'Dr. Robert Smith',
      providerSpecialty: 'Cardiology',
      granted: true,
      requestDate: getDate(200),
      grantDate: getDate(199),
      expiryDate: getDate(-165), // 6 months in future
      accessLevel: 'full'
    }
  ]
};

// Mock Notifications
export const notifications: { [key: string]: Notification[] } = {
  'p1': [
    {
      id: 'notif1',
      userId: 'p1',
      title: 'Access Request',
      message: 'Dr. Rajiv Patel has requested access to your medical records.',
      date: getDate(2),
      read: false,
      type: 'access',
      actionId: 'acc3'
    },
    {
      id: 'notif2',
      userId: 'p1',
      title: 'Appointment Reminder',
      message: 'You have an upcoming appointment with Dr. Robert Smith tomorrow at 10:00 AM.',
      date: getDate(1),
      read: true,
      type: 'appointment',
      actionId: null
    },
    {
      id: 'notif3',
      userId: 'p1',
      title: 'New Record Added',
      message: 'Dr. Robert Smith has added a new consultation record to your health history.',
      date: getDate(2),
      read: false,
      type: 'record',
      actionId: 'rec1'
    },
    {
      id: 'notif4',
      userId: 'p1',
      title: 'Access Expiring',
      message: 'Dr. Lisa Johnson\'s access to your records expires in 5 days. Consider renewing if needed.',
      date: getDate(6),
      read: true,
      type: 'access',
      actionId: 'acc2'
    }
  ],
  'dr1': [
    {
      id: 'notif5',
      userId: 'dr1',
      title: 'Access Granted',
      message: 'Jane Doe has granted you access to their medical records.',
      date: getDate(89),
      read: true,
      type: 'access',
      actionId: 'acc1'
    },
    {
      id: 'notif6',
      userId: 'dr1',
      title: 'New Patient Assignment',
      message: 'You have been assigned John Smith as a new patient.',
      date: getDate(198),
      read: true,
      type: 'assignment',
      actionId: null
    },
    {
      id: 'notif7',
      userId: 'dr1',
      title: 'Lab Results Available',
      message: 'New laboratory results are available for Jane Doe.',
      date: getDate(30),
      read: false,
      type: 'record',
      actionId: 'rec2'
    }
  ]
};

// Mock Audit Log
export const auditLogs = [
  {
    id: 'audit1',
    date: getDate(2),
    action: 'Record Access',
    user: 'Dr. Robert Smith',
    userId: 'dr1',
    details: 'Accessed medical record #rec1 for patient Jane Doe',
    patientId: 'p1'
  },
  {
    id: 'audit2',
    date: getDate(2),
    action: 'Record Creation',
    user: 'Dr. Robert Smith',
    userId: 'dr1',
    details: 'Created new consultation record #rec1 for patient Jane Doe',
    patientId: 'p1'
  },
  {
    id: 'audit3',
    date: getDate(30),
    action: 'Record Creation',
    user: 'Dr. Robert Smith',
    userId: 'dr1',
    details: 'Created new laboratory result record #rec2 for patient Jane Doe',
    patientId: 'p1'
  },
  {
    id: 'audit4',
    date: getDate(89),
    action: 'Access Granted',
    user: 'Jane Doe',
    userId: 'p1',
    details: 'Granted full access to Dr. Robert Smith',
    patientId: 'p1'
  },
  {
    id: 'audit5',
    date: getDate(90),
    action: 'Record Creation',
    user: 'Dr. Lisa Johnson',
    userId: 'dr2',
    details: 'Created new vaccination record #rec3 for patient Jane Doe',
    patientId: 'p1'
  },
  {
    id: 'audit6',
    date: getDate(94),
    action: 'Access Granted',
    user: 'Jane Doe',
    userId: 'p1',
    details: 'Granted limited access to Dr. Lisa Johnson',
    patientId: 'p1'
  },
  {
    id: 'audit7',
    date: getDate(180),
    action: 'Record Creation',
    user: 'Dr. Robert Smith',
    userId: 'dr1',
    details: 'Created new physical examination record #rec4 for patient Jane Doe',
    patientId: 'p1'
  },
  {
    id: 'audit8',
    date: getDate(2),
    action: 'Access Request',
    user: 'Dr. Rajiv Patel',
    userId: 'dr3',
    details: 'Requested access to patient Jane Doe\'s records',
    patientId: 'p1'
  }
];

// Helper functions to simulate database operations
export const getPatientById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

export const getProviderById = (id: string): Provider | undefined => {
  return providers.find(p => p.id === id);
};

export const getPatientRecords = (patientId: string): MedicalRecord[] => {
  return medicalRecords[patientId] || [];
};

export const getPatientPermissions = (patientId: string): AccessPermission[] => {
  return accessPermissions[patientId] || [];
};

export const getUserNotifications = (userId: string): Notification[] => {
  return notifications[userId] || [];
};

export const getPatientsByProvider = (providerId: string): Patient[] => {
  // Find all patients where this provider has access
  const patientIds = new Set<string>();
  
  Object.entries(accessPermissions).forEach(([patientId, permissions]) => {
    permissions.forEach(permission => {
      if (permission.providerId === providerId && permission.granted) {
        patientIds.add(patientId);
      }
    });
  });
  
  return patients.filter(patient => patientIds.has(patient.id));
};

export const getAuditLogsByPatient = (patientId: string) => {
  return auditLogs.filter(log => log.patientId === patientId);
};
