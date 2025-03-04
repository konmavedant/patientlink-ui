
// User types
export interface User {
  id: string;
  username: string;
  password: string;
  type: 'patient' | 'provider';
}

export interface Patient extends User {
  type: 'patient';
  name: string;
  dob: string;
  gender: string;
  bloodType: string;
  address: string;
  phone: string;
  email: string;
  emergencyContact: string;
  allergies: string[];
  chronicConditions: string[];
  profileImage: string;
}

export interface Provider extends User {
  type: 'provider';
  name: string;
  specialty: string;
  hospitalAffiliation: string;
  licenseNumber: string;
  phone: string;
  email: string;
  profileImage: string;
}

// Medical record
export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  type: string;
  provider: string;
  providerId: string;
  diagnosis: string;
  notes: string;
  prescription: string;
  attachments: string[];
}

// Access permission
export interface AccessPermission {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  providerSpecialty: string;
  granted: boolean;
  requestDate: string;
  grantDate: string | null;
  expiryDate: string | null;
  accessLevel: 'none' | 'limited' | 'full';
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'access' | 'appointment' | 'record' | 'assignment' | 'other';
  actionId: string | null;
}

// Auth context
export interface AuthContextType {
  currentUser: Patient | Provider | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
