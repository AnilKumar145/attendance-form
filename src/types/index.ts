export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface QRSession {
  id: string;
  qr_code: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface LocationValidation {
  valid: boolean;
  message: string;
  distance?: number;
}