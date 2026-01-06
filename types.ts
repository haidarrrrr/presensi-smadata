
export type UserRole = 'student' | 'teacher';

export interface Student {
  id: string;
  name: string;
  class: string;
  points: number;
  violations: number;
  avatar: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  timestamp: number;
  type: 'in' | 'out';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 'ontime' | 'late' | 'invalid';
}

export interface PointLog {
  id: string;
  studentId: string;
  title: string;
  description: string;
  points: number; // Positive for reward, negative for violation
  type: 'reward' | 'violation' | 'note';
  date: number;
}

export interface AppState {
  currentUser: Student;
  attendance: AttendanceRecord[];
  history: PointLog[];
}
