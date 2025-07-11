import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppointments } from '@/hooks/useAppointments';
import { patients, doctors } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AppointmentForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  
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

  const handleSubmit = (e: React.FormEvent) => {
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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6 flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/calendar')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Calendar</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {isEditing ? 'Edit Appointment' : 'New Appointment'}
            {isEditing && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select value={formData.patientId} onValueChange={(value) => handleChange('patientId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">{patient.email}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor *</Label>
              <Select value={formData.doctorId} onValueChange={(value) => handleChange('doctorId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: doctor.color }}
                        />
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the appointment..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{isEditing ? 'Update Appointment' : 'Create Appointment'}</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};