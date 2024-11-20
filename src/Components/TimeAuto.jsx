import React, { useState, useMemo, useEffect } from 'react';

const TimeRangePicker = ({ initialFromTime, initialToTime, onTimeChange }) => {
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

  const advanceTimeByOneHour = (currentTime) => {
    const currentIndex = timeOptions.indexOf(currentTime);
    const nextIndex = Math.min(currentIndex + 2, timeOptions.length - 1);
    return timeOptions[nextIndex];
  };

  const defaultFromTime = initialFromTime || timeOptions[0] || "09:30";
  const defaultToTime = initialToTime || findOneHourLater(defaultFromTime);

  const [fromTime, setFromTime] = useState(defaultFromTime);
  const [toTime, setToTime] = useState(defaultToTime);
  const [error, setError] = useState('');

  useEffect(() => {
    if (fromTime && toTime) {
      console.log(`Time Range Selected: ${fromTime} - ${toTime} (1 hour)`);
      onTimeChange(fromTime, toTime);
    }
  }, [fromTime, toTime, onTimeChange]);

  const handleSubmitSuccess = () => {
    const nextFromTime = advanceTimeByOneHour(fromTime);
    if (nextFromTime) {
      const nextToTime = findOneHourLater(nextFromTime);
      setFromTime(nextFromTime);
      setToTime(nextToTime);
      console.log(`Advanced to next hour - From: ${nextFromTime}, To: ${nextToTime}`);
    } else {
      setError('Cannot advance time further');
    }
  };

  const formatTimeDisplay = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${period}`;
  };

  const getMinutesFromTime = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const validateTimeRange = (from, to) => {
    if (!from || !to) return false;
    const fromMinutes = getMinutesFromTime(from);
    const toMinutes = getMinutesFromTime(to);
    const diffMinutes = toMinutes - fromMinutes;

    if (fromMinutes >= toMinutes) {
      setError('End time must be after start time');
      return false;
    }
    
    if (diffMinutes !== 60) {
      setError('Time range must be exactly one hour');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleFromTimeChange = (e) => {
    const newFromTime = e.target.value;
    const newToTime = findOneHourLater(newFromTime);
    
    setFromTime(newFromTime);
    setToTime(newToTime);
    validateTimeRange(newFromTime, newToTime);
  };

  const handleToTimeChange = (e) => {
    const newToTime = e.target.value;
    setToTime(newToTime);
    validateTimeRange(fromTime, newToTime);
  };

  const getValidToOptions = () => {
    const fromIndex = timeOptions.indexOf(fromTime);
    const oneHourLaterIndex = fromIndex + 2;
    return timeOptions.slice(oneHourLaterIndex - 1, oneHourLaterIndex + 1);
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600">From</label>
            <select
              value={fromTime}
              onChange={handleFromTimeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              onChange={handleToTimeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {getValidToOptions().map((time) => (
                <option key={`to-${time}`} value={time}>
                  {formatTimeDisplay(time)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
      <div className="text-sm text-gray-600">
        {formatTimeDisplay(fromTime)} - {formatTimeDisplay(toTime)}
        <span className="ml-2 text-green-600">(1 hour)</span>
      </div>
                        
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmitSuccess}
        disabled={timeOptions.indexOf(fromTime) >= timeOptions.length - 2}
      >
        Next Hour
      </button>
    </div>
  );
};

export default TimeRangePicker;