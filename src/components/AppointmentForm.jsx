import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppointments } from '@/hooks/useAppointments';
import { patients, doctors } from '@/data/mockData';
import { ArrowLeft, Save, Trash2, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export const AppointmentForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { toast } = useToast();
  
  const appointmentId = searchParams.get('id');
  const selectedDate = searchParams.get('date');
  const isEditing = !!appointmentId;
  
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: selectedDate || '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    if (isEditing && appointmentId) {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (appointment) {
        setFormData({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          date: appointment.date,
          time: appointment.time,
          notes: appointment.notes || '',
        });
      }
    }
  }, [isEditing, appointmentId, appointments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && appointmentId) {
      updateAppointment(appointmentId, formData);
      toast({
        title: "Appointment updated",
        description: "The appointment has been successfully updated.",
      });
    } else {
      addAppointment(formData);
      toast({
        title: "Appointment created",
        description: "The appointment has been successfully created.",
      });
    }
    
    navigate('/calendar');
  };

  const handleDelete = () => {
    if (appointmentId) {
      deleteAppointment(appointmentId);
      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully deleted.",
      });
      navigate('/calendar');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6 flex items-center space-x-4">
        <button
          onClick={() => navigate('/calendar')}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Calendar</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Appointment' : 'New Appointment'}
            </h2>
            {isEditing && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <div className="space-y-2">
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Patient *
              </label>
              <div className="relative">
                <select
                  value={formData.patientId}
                  onChange={(e) => handleChange('patientId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.email}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Doctor *
              </label>
              <div className="relative">
                <select
                  value={formData.doctorId}
                  onChange={(e) => handleChange('doctorId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date *
                </label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time *
                </label>
                <input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                id="notes"
                placeholder="Additional notes about the appointment..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Save className="h-4 w-4" />
              <span>{isEditing ? 'Update Appointment' : 'Create Appointment'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};