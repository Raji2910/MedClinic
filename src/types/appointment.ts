export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  color: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  notes?: string;
}

export interface AppointmentWithDetails extends Appointment {
  patient: Patient;
  doctor: Doctor;
}