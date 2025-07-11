import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <CardTitle className="text-lg">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Add Appointment Button */}
      <Button 
        onClick={handleAddAppointment}
        className="w-full flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Add Appointment</span>
      </Button>

      {/* Appointments List */}
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No appointments today</p>
                <p className="text-sm">Click "Add Appointment" to schedule one.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card 
              key={appointment.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleEditAppointment(appointment.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Time */}
                  <div className="flex-shrink-0">
                    <div className="text-lg font-bold text-primary">
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
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground truncate">
                        {appointment.patient.name}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">
                      with {appointment.doctor.name}
                    </p>
                    
                    <p className="text-sm text-muted-foreground">
                      {appointment.doctor.specialty}
                    </p>
                    
                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{appointment.notes}"
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};