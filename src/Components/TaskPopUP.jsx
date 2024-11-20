import React, { useContext, useEffect, useState, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import EmployeeSelector from "./AddTask"; 
import dayjs from "dayjs";
import { GlobalContext } from "../Context/GlobleContext";
import axios from "axios";
import { getAllTask } from "../services";

const TaskPopUp = ({ event = {}, isOpen, onClose }) => {
  const { monthIndex } = useContext(GlobalContext);
  const [title, setTitle] = useState(event.title || "");
  const [description, setDescription] = useState(event.description || "");
  const [date, setDate] = useState(event.date || dayjs().format("YYYY-MM-DD"));
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [taskTitles, setTaskTitles] = useState([]);
  const [taskDescriptions, setTaskDescriptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleEmployeesChange = (employees) => {
    setSelectedEmployees(employees);
    // console.log("Selected employees updated:", employees);
  };

  const timeOptions = useMemo(() => {
    const options = [];
    let currentHour = 9;
    let currentMinute = 30;

    while (currentHour < 18 || (currentHour === 18 && currentMinute <= 30)) {
      const hours = String(currentHour).padStart(2, '0');
      const minutes = String(currentMinute).padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      options.push(timeString);

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }
    return options;
  }, []);

  const findOneHourLater = (fromTime) => {
    const fromIndex = timeOptions.indexOf(fromTime);
    const targetIndex = Math.min(fromIndex + 2, timeOptions.length - 1);
    return timeOptions[targetIndex];
  };

  const formatTimeDisplay = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };


  const validateTimeRange = (from, to) => {
    if (!from || !to) return false;
    const fromIndex = timeOptions.indexOf(from);
    const toIndex = timeOptions.indexOf(to);
    
    if (fromIndex === -1 || toIndex === -1) return false;
    return fromIndex < toIndex;
  };

  const handleTimeChange = (from, to) => {
    if (from) {
      setFromTime(from);
      if (!to) {
        const newToTime = findOneHourLater(from);
        setToTime(newToTime);
      } else if (validateTimeRange(from, to)) {
        setToTime(to);
      } else {
        setToTime(findOneHourLater(from));
      }
    }
  };

  const handleToTimeChange = (to) => {
    if (validateTimeRange(fromTime, to)) {
      setToTime(to);
    } else {
      setError('End time must be after start time');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmitSuccess = () => {
    const fromIndex = timeOptions.indexOf(fromTime);
    if (fromIndex < timeOptions.length - 2) {
      const nextFromTime = timeOptions[fromIndex + 2];
      const nextToTime = findOneHourLater(nextFromTime);
      setFromTime(nextFromTime);
      setToTime(nextToTime);
      setTitle("");
      setDescription("");
      setSuccessMessage("Task Submit  successfully");
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } else {
      setError('No more available time slots today');
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchTasks = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(getAllTask);
        
console.log("response", response)

        if (!mounted) return;
        if (response.data?.data && Array.isArray(response.data.data)) {
          const taskMap = new Map();
          
          response.data.data.forEach(task => {
            if (!taskMap.has(task.title)) {
              taskMap.set(task.title, {
                title: task.title,
                description: task.description,
               

              });
            }
          });

          setTaskTitles(Array.from(taskMap.values()).map(task => task.title));
          setTaskDescriptions(Array.from(taskMap.values()).map(task => task.description));
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
    return () => { mounted = false; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !fromTime) {
      const currentTime = dayjs();
      const hour = currentTime.hour();
      const minute = currentTime.minute();
      
      // Find the next available time slot
      const nextSlot = timeOptions.find(time => {
        const [slotHour, slotMinute] = time.split(':').map(Number);
        return (slotHour > hour) || (slotHour === hour && slotMinute > minute);
      }) || timeOptions[0];

      handleTimeChange(nextSlot);
    }
  }, [isOpen, timeOptions]);

  const validateForm = () => {
    if (!title.trim()) {
      setError('Task title is required');
      return false;
    }
    if (!description.trim()) {
      setError('Task description is required');
      return false;
    }
    if (!date) {
      setError('Date is required');
      return false;
    }
    if (!fromTime || !toTime) {
      setError('Both start and end times are required');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(dayjs().format("YYYY-MM-DD"));
    setFromTime("");
    setToTime("");
    setSelectedEmployees([]);

    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const taskSubmit = {
      title,
      description,
      date,
      employees: selectedEmployees,
    fromTime,
      toTime
    };
    
    try {
    
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Task submitted:", taskSubmit);
      setSuccessMessage("Task submitted successfully!");
      handleSubmitSuccess();
      
    } catch (error) {
      console.error("Error submitting task:", error);
      setError('Failed to submit task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTitleSelect = (selectedTitle, index) => {
    setTitle(selectedTitle);
    setDescription(taskDescriptions[index]);
    setIsDropdownOpen(false);
  };

  const getCurrentDateClass = () => {
    return dayjs().format("YYYY-MM-DD") === date ? "rounded-full text-black px-2" : "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Task</h2>
          <button
            onClick={handleClose}
            className="text-red-600 hover:text-blue-600 transition-colors"
            disabled={isLoading}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Task Title
            </label>
          

            <div className="relative">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-yellow-600 shadow-sm focus:border-yellow-600 focus:ring focus:ring-yellow-400 focus:ring-opacity-50 pr-10"
                placeholder="Enter or select task title"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-600 hover:text-yellow-600"
                disabled={isLoading}
                aria-label="Toggle task titles dropdown"
              >
                <ChevronDown size={20} />
              </button>
            </div>
            {isDropdownOpen && taskTitles.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {taskTitles.map((taskTitle, index) => (
                  <div
                    key={`${taskTitle}-${index}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTitleSelect(taskTitle, index)}
                    role="option"
                  >
                    {taskTitle}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Task Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter Task Description"
              disabled={isLoading}
            />
          </div>
          <EmployeeSelector onEmployeesChange={handleEmployeesChange} />
          
          <div className="bg-white rounded-lg">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Task Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center mt-2">
              <div className="flex-1">
                <div className={`font-medium text-gray-900 mb-2 ${getCurrentDateClass()}`}>
                  {dayjs(date).format("MMMM DD, YYYY")}
                </div>
                <div className="space-y-4">
                <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-600">From</label>
          <select
            value={fromTime}
            onChange={(e) => handleTimeChange(e.target.value, toTime)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          >   
            {timeOptions.slice(0, -2).map((time) => (
              <option key={`from-${time}`} value={time}>
                {formatTimeDisplay(time)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600">To</label>
          <select
            value={toTime}
            onChange={(e) => handleToTimeChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          >
            {timeOptions.slice(timeOptions.indexOf(fromTime) + 1).map((time) => (
              <option key={`to-${time}`} value={time}>
                {formatTimeDisplay(time)}
              </option>
            ))}
          </select>
        </div>
      </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-200   text-black rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || isSubmitting || (timeOptions.indexOf(fromTime) >= timeOptions.length - 2)}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || isSubmitting}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default TaskPopUp;   