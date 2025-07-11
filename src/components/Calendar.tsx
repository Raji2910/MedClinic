import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { MonthView } from './calendar/MonthView';
import { DayView } from './calendar/DayView';
import { Filter } from './Filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleDateJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setCurrentDate(newDate);
    }
  };

  const handleAddAppointment = () => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    navigate(`/appointment/new?date=${dateStr}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Medical Calendar</span>
            </CardTitle>
            
            <Button onClick={handleAddAppointment} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Appointment</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Date Navigation */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                
                {/* Date Jump Input */}
                <Input
                  type="date"
                  value={format(currentDate, 'yyyy-MM-dd')}
                  onChange={handleDateJump}
                  className="w-auto"
                />
              </div>
              
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter */}
        <Filter 
          selectedDoctor={selectedDoctor}
          onDoctorChange={setSelectedDoctor}
        />
      </div>

      {/* Calendar Views */}
      <Card>
        <CardContent className="p-6">
          {isMobile ? (
            <DayView 
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              selectedDoctor={selectedDoctor}
            />
          ) : (
            <MonthView 
              currentDate={currentDate}
              selectedDoctor={selectedDoctor}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};