import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskPopUP from './TaskPopUP';

const CreateEventButton = ({ onDayClick, selectedDay }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (onDayClick && selectedDay) {
      onDayClick(selectedDay);
    }
    setIsOpen(true);
  };
  return (
    <>
   
      <div className="ml-4">
    
        <button 
         onClick={handleClick}
        className="border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl">
          <Plus className="w-10 h-10 text-violet-500"/>
          <span  className="pl-4 pr-8 text-xl" >Create</span>
          
        </button>
      </div>
      <TaskPopUP isOpen={isOpen} onClose={() => setIsOpen(false)} />


        
    </>
  );
};

export default CreateEventButton;