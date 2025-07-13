import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { patients, doctors } from '../data/mockData';

export const useAppointments = create()(
  persist(
    (set, get) => ({
      appointments: [
        // Sample appointments
        {
          id: '1',
          patientId: '1',
          doctorId: '1',
          date: '2024-07-15',
          time: '09:00',
          notes: 'Annual checkup'
        },
        {
          id: '2',
          patientId: '2',
          doctorId: '2',
          date: '2024-07-15',
          time: '10:30',
          notes: 'Heart consultation'
        },
        {
          id: '3',
          patientId: '3',
          doctorId: '3',
          date: '2024-07-16',
          time: '14:00',
          notes: 'Skin examination'
        },
      ],
      
      addAppointment: (appointment) => {
        const newAppointment = {
          ...appointment,
          id: Date.now().toString(),
        };
        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }));
      },
      
      updateAppointment: (id, updatedAppointment) => {
        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === id ? { ...appointment, ...updatedAppointment } : appointment
          ),
        }));
      },
      
      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((appointment) => appointment.id !== id),
        }));
      },
      
      getAppointmentsWithDetails: () => {
        const { appointments } = get();
        return appointments.map((appointment) => {
          const patient = patients.find((p) => p.id === appointment.patientId);
          const doctor = doctors.find((d) => d.id === appointment.doctorId);
          return { ...appointment, patient, doctor };
        });
      },
      
      getAppointmentsByDate: (date) => {
        const appointmentsWithDetails = get().getAppointmentsWithDetails();
        return appointmentsWithDetails.filter((appointment) => appointment.date === date);
      },
      
      getAppointmentsByDoctor: (doctorId) => {
        const appointmentsWithDetails = get().getAppointmentsWithDetails();
        return appointmentsWithDetails.filter((appointment) => appointment.doctorId === doctorId);
      },
    }),
    {
      name: 'appointments-storage',
    }
  )
);