import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '@/hooks/useAppointments';
import { Plus } from 'lucide-react';

interface MonthViewProps {
  currentDate: Date;
  selectedDoctor: string;
}

export const MonthView = ({ currentDate, selectedDoctor }: MonthViewProps) => {
  const navigate = useNavigate();
  const { getAppointmentsByDate, getAppointmentsByDoctor } = useAppointments();

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = startDate.getDay();

  // Create empty cells for days before the month starts
  const leadingEmptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const getDayAppointments = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    let appointments = getAppointmentsByDate(dateStr);
    
    if (selectedDoctor !== 'all') {
      appointments = appointments.filter(apt => apt.doctorId === selectedDoctor);
    }
    
    return appointments;
  };

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    navigate(`/appointment/new?date=${dateStr}`);
  };

  const handleAppointmentClick = (e: React.MouseEvent, appointmentId: string) => {
    e.stopPropagation();
    navigate(`/appointment/edit?id=${appointmentId}`);
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leading empty days */}
        {leadingEmptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-24 bg-gray-100 dark:bg-gray-700 rounded-md" />
        ))}

        {/* Days of the month */}
        {daysInMonth.map((date) => {
          const appointments = getDayAppointments(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isTodayDate = isToday(date);

          return (
            <div
              key={date.toISOString()}
              className={`
                h-24 cursor-pointer transition-colors rounded-md border
                ${!isCurrentMonth ? 'opacity-50' : ''}
                ${isTodayDate ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}
                border-gray-200 dark:border-gray-600
              `}
              onClick={() => handleDayClick(date)}
            >
              <div className="p-2 h-full flex flex-col">
                <div className={`text-sm font-medium mb-1 ${isTodayDate ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-900 dark:text-white'}`}>
                  {format(date, 'd')}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {appointments.length > 0 && (
                    <div className="space-y-1">
                      {appointments.slice(0, 2).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80"
                          style={{ backgroundColor: appointment.doctor.color }}
                          onClick={(e) => handleAppointmentClick(e, appointment.id)}
                          title={`${appointment.patient.name} - ${appointment.time}`}
                        >
                          {appointment.time} {appointment.patient.name}
                        </div>
                      ))}
                      {appointments.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{appointments.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                  
                  {appointments.length === 0 && (
                    <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                      <Plus className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};