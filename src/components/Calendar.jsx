import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { MonthView } from './calendar/MonthView';
import { DayView } from './calendar/DayView';
import { Filter } from './Filter';
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

  const handleDateJump = (e) => {
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <h1 className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
              <CalendarIcon className="h-5 w-5" />
              <span>MedClinic Calendar</span>
            </h1>
            
            <button 
              onClick={handleAddAppointment} 
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Date Navigation */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                
                {/* Date Jump Input */}
                <input
                  type="date"
                  value={format(currentDate, 'yyyy-MM-dd')}
                  onChange={handleDateJump}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter */}
        <Filter 
          selectedDoctor={selectedDoctor}
          onDoctorChange={setSelectedDoctor}
        />
      </div>

      {/* Calendar Views */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
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
        </div>
      </div>
    </div>
  );
};