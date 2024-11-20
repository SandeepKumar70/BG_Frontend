import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const SuccessSnackbar = ({ 
  message = "Operation completed successfully",
  isOpen = false,
  duration = 3000,
  onClose = () => {} 
}) => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setShow(isOpen);
    setProgress(100);
    
    if (isOpen) {
      const step = 10;
      const totalSteps = duration / step;
      const progressStep = 100 / totalSteps;
      
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.max(prev - progressStep, 0));
      }, step);

      const timer = setTimeout(() => {
        clearInterval(progressInterval);
        setShow(false);
        onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isOpen, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300
      ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-green-50 border border-green-100">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <p className="text-green-700 font-medium">{message}</p>
        <button
          onClick={() => {
            setShow(false);
            onClose();
          }}
          className="ml-2 p-1 hover:bg-green-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-green-500" />
        </button>
        <div className="absolute bottom-0 left-0 h-1 bg-green-200 rounded-b-lg transition-all duration-300"
             style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

// Demo Component
const DemoSuccessSnackbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const showSnackbar = () => {
    setIsOpen(true);
  };

  return (
    <div className="p-4">
      <button
        onClick={showSnackbar}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                 transition-colors duration-200 flex items-center gap-2"
      >
        <CheckCircle2 className="w-5 h-5" />
        Show Success Message
      </button>

      <SuccessSnackbar
        isOpen={isOpen}
        message="Operation completed successfully!"
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default DemoSuccessSnackbar;