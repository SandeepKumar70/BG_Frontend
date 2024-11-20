
// TaskManager.jsx
import React, { useState } from 'react';
import TaskPopUP from './TaskPopUP';

const TaskManager = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpenPopup = (event = null) => {
    setSelectedEvent(event);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-4">
      <button 
        onClick={() => handleOpenPopup()}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add New Task
      </button>

      <TaskPopUP 
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        event={selectedEvent}
      />
    </div>
  );
};

export default TaskManager;
