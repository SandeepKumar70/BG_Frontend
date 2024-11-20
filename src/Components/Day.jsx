import PropTypes from "prop-types";
import dayjs from "dayjs";
import React, { useState } from "react";
import TaskPopUP from "./TaskPopUP";

export default function Day({ day, rowIdx, onDayHover, onDayClick }) {
  const [isOpen, setIsOpen] = useState(false);
  function getCurrentDayClass() {
    return day?.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  const handleClick = () => {
    if (onDayClick) {
      onDayClick(day);
    }
    setIsOpen(true);
  };

  return (
    <>
        <div 
            onClick={handleClick}
            className={`border border-gray-200 flex flex-col cursor-pointer hover:bg-slate-200`}
            role="gridcell"
            aria-label={day?.format("MMMM D, YYYY")}
        >
            <div className="flex flex-col items-center">
                {rowIdx === 0 && (
                    <p className="text-sm mt-1 font-medium">
                        {day?.format("ddd").toUpperCase()}
                    </p>
                )}
                <p
                    className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()}`}
                    aria-current={day?.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? "date" : undefined}
                >
                    {day?.format("DD")}
                </p>
            </div>
        </div>
        <TaskPopUP isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
);
}

Day.propTypes = {
  day: PropTypes.instanceOf(dayjs),
  rowIdx: PropTypes.number.isRequired,
  onDayHover: PropTypes.func,
  onDayClick: PropTypes.func,
};
