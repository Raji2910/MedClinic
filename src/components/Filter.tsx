import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { doctors } from '@/data/mockData';
import { Filter as FilterIcon } from 'lucide-react';

interface FilterProps {
  selectedDoctor: string;
  onDoctorChange: (doctorId: string) => void;
}

export const Filter = ({ selectedDoctor, onDoctorChange }: FilterProps) => {
  return (
    <div className="flex items-center space-x-2 bg-card p-3 rounded-lg border">
      <FilterIcon className="h-4 w-4 text-muted-foreground" />
      <Label htmlFor="doctor-filter" className="text-sm font-medium whitespace-nowrap">
        Filter by Doctor:
      </Label>
      <Select value={selectedDoctor} onValueChange={onDoctorChange}>
        <SelectTrigger id="doctor-filter" className="w-[200px]">
          <SelectValue placeholder="All Doctors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Doctors</SelectItem>
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id}>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: doctor.color }}
                />
                <span>{doctor.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};