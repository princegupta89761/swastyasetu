export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  medicalHistory?: string;
  allergies?: string;
  createdAt: string;
}

export interface HealthRecord {
  id?: string;
  uid: string;
  title: string;
  type: 'report' | 'prescription' | 'bill' | 'other';
  date: string;
  description?: string;
  fileUrl?: string;
  createdAt: string;
}

export interface SymptomLog {
  id?: string;
  uid: string;
  symptoms: string[];
  severity: number;
  notes?: string;
  timestamp: any; // Firestore Timestamp
  riskLevel: 'low' | 'medium' | 'high';
}

export interface EmergencyAlert {
  id?: string;
  uid: string;
  location?: {
    lat: number;
    lng: number;
  };
  timestamp: any;
  status: 'active' | 'resolved';
}
