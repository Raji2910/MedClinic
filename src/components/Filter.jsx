import { doctors } from '@/data/mockData';
import { Filter as FilterIcon, ChevronDown } from 'lucide-react';

export const Filter = ({ selectedDoctor, onDoctorChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
      <FilterIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <label htmlFor="doctor-filter" className="text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
        Filter by Doctor:
      </label>
      <div className="relative">
        <select
          id="doctor-filter"
          value={selectedDoctor}
          onChange={(e) => onDoctorChange(e.target.value)}
          className="w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
        >
          <option value="all">All Doctors</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};