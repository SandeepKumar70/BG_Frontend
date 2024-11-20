import React, { useState, useRef, useEffect } from 'react';
import { X, User, Search, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { getAllEmployee } from '../services';

const base_url = import.meta.env.VITE_BACKEND_LIVE;

const EmployeeSelector = ({ onEmployeesChange }) => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);


  const fetchEmployees = async () => {
    if (!isOpen) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // const response = await fetch('/employee/getAllEmployee');
      const response = await axios.get(getAllEmployee);
      if (!response.ok) throw new Error('Failed to fetch employees');
      
      const data = await response.json();
      const employees = data.data || [];
      setSuggestions(employees);
    } catch (err) {
      setError('Could not load employees. Please try again.');
      console.error('Error fetching employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
    
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = suggestions.filter(employee => 
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedEmployees.some(selected => selected.id === employee.id)
  );

  const handleSelectEmployee = (employee) => {
    const updatedEmployees = [...selectedEmployees, employee];
    setSelectedEmployees(updatedEmployees);
    onEmployeesChange?.(updatedEmployees);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemoveEmployee = (employeeId) => {
    const updatedEmployees = selectedEmployees.filter(emp => emp.id !== employeeId);
    setSelectedEmployees(updatedEmployees);
    onEmployeesChange?.(updatedEmployees);
  };

  return (
    <div className="w-full space-y-4" ref={containerRef}>
      <div className="flex flex-wrap gap-2">
        {selectedEmployees.map(employee => (
             <div 
              key={employee.id}
             className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
             > 
             <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              {employee.name[0].toUpperCase()}
             </span>
             <span>{employee.name}</span>
             <button
              onClick={() => handleRemoveEmployee(employee.id)}
              className="hover:bg-blue-100 rounded-full p-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2 border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
          <Search size={18} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="flex-1 outline-none text-sm"
            placeholder="Search employees..."
          />
        </div>

        {isOpen && (
          <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
            {isLoading ? (
              <div className="p-3 text-gray-500">Loading employees...</div>
            ) : error ? (
              <div className="p-3 text-red-500 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            ) : filteredSuggestions.length > 0 ? (
              filteredSuggestions.map(employee => (
                <div
                  key={employee.id}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                  onClick={() => handleSelectEmployee(employee)}
                >
                  <User size={16} className="text-gray-400" />
                  <div>
                    <div>{employee.name}</div>
                    {employee.department && (
                      <div className="text-sm text-gray-500">{employee.department}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No matching employees found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSelector;