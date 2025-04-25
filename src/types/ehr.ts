
export type UserRole = 'patient' | 'provider';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  walletAddress?: string; // Added wallet address to be used with blockchain
};

export type Patient = User & {
  role: 'patient';
  dateOfBirth: string;
  insuranceProvider?: string;
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
};

export type Provider = User & {
  role: 'provider';
  specialty: string;
  license: string;
  hospital?: string;
  walletAddress?: string; // Ensure wallet address is available for providers
};

export type RecordType = 
  | 'visit'
  | 'diagnosis'
  | 'prescription'
  | 'lab'
  | 'vaccination'
  | 'vitals'
  | 'imaging'
  | 'note';

export type MedicalRecord = {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  type: RecordType;
  title: string;
  date: string;
  description: string;
  details?: Record<string, any>;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  blockchainHash?: string;
  lastModified: string;
};

export type AccessPermission = {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  providerSpecialty: string;
  status: 'granted' | 'pending' | 'revoked';
  dateRequested: string;
  dateModified?: string;
  expirationDate?: string;
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  action: 'view' | 'create' | 'update' | 'delete' | 'grant' | 'revoke';
  performedBy: {
    id: string;
    name: string;
    role: UserRole;
  };
  recordId?: string;
  recordType?: string;
  patientId?: string;
  details: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'access' | 'update' | 'alert';
  relatedId?: string;
};
