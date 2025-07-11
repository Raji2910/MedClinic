import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '@/hooks/useAppointments';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';

interface DayViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedDoctor: string;
}

export const DayView = ({ currentDate, onDateChange, selectedDoctor }: DayViewProps) => {
  const navigate = useNavigate();
  const { getAppointmentsByDate } = useAppointments();

  const dateStr = format(currentDate, 'yyyy-MM-dd');
  let appointments = getAppointmentsByDate(dateStr);
  
  if (selectedDoctor !== 'all') {
    appointments = appointments.filter(apt => apt.doctorId === selectedDoctor);
  }

  // Sort appointments by time
  appointments.sort((a, b) => a.time.localeCompare(b.time));

  const handlePrevDay = () => {
    onDateChange(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(currentDate, 1));
  };

  const handleAddAppointment = () => {
    navigate(`/appointment/new?date=${dateStr}`);
  };

  const handleEditAppointment = (appointmentId: string) => {
    navigate(`/appointment/edit?id=${appointmentId}`);
  };

  return (
    <div className="w-full space-y-4">
      {/* Day Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handlePrevDay}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h2>
            </div>
            
            <button 
              onClick={handleNextDay}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Appointment Button */}
      <button 
        onClick={handleAddAppointment}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Add Appointment</span>
      </button>

      {/* Appointments List */}
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="p-6 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No appointments today</p>
                <p className="text-sm">Click "Add Appointment" to schedule one.</p>
              </div>
            </div>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div 
              key={appointment.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleEditAppointment(appointment.id)}
            >
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Time */}
                  <div className="flex-shrink-0">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {format(new Date(`2000-01-01T${appointment.time}`), 'h:mm a')}
                    </div>
                  </div>

                  {/* Doctor Color Indicator */}
                  <div 
                    className="w-1 h-16 rounded-full flex-shrink-0"
                    style={{ backgroundColor: appointment.doctor.color }}
                  />

                  {/* Appointment Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {appointment.patient.name}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      with {appointment.doctor.name}
                    </p>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.doctor.specialty}
                    </p>
                    
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                        "{appointment.notes}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};