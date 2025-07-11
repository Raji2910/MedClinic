import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leading empty days */}
        {leadingEmptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-24 bg-muted/20 rounded-md" />
        ))}

        {/* Days of the month */}
        {daysInMonth.map((date) => {
          const appointments = getDayAppointments(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isTodayDate = isToday(date);

          return (
            <Card
              key={date.toISOString()}
              className={cn(
                "h-24 cursor-pointer transition-colors hover:bg-calendar-hover",
                !isCurrentMonth && "opacity-50",
                isTodayDate && "ring-2 ring-calendar-selected"
              )}
              onClick={() => handleDayClick(date)}
            >
              <CardContent className="p-2 h-full flex flex-col">
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isTodayDate && "text-primary font-bold"
                )}>
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
                        <div className="text-xs text-muted-foreground">
                          +{appointments.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                  
                  {appointments.length === 0 && (
                    <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};