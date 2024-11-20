import React, { useState, useContext } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { ChevronDown } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineContactSupport } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { MdOutlineAddTask } from "react-icons/md";
import { GlobalContext } from "../Context/GlobleContext";
import dayjs from "dayjs";

export default function Header() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  const [selected, setSelected] = useState("Day");
  const [isOpen, setIsOpen] = useState(false);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
  }

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    
    // Handle  add day 
    if (option === "Day") {
      handleReset();
    }
    // Add handlers Month 
  };

  const dropdownOptions = [
    { label: "Day", action: handleReset },
    // { label: "Month", action: null },
    // { label: "Year", action: null }
  ];

  return (
    <div className=" h-16 flex ">
      <RxHamburgerMenu className=" h-14 flex text-2xl	ml-4" />

      <img className="ml-2 w-10 h-12 pt-3  " src="hlo.png" alt="brand" />
      <h1 className="text-2xl font-medium	 pt-4 ml-4">Calender</h1>
      <button>
        <div
          onClick={handleReset}
          className="ml-8 border-2 text-2xl font-normal	border-solid rounded px-4 "
        > Today
        </div>
      </button>
      
      <button className="flex pt-3">
        <MdKeyboardArrowLeft onClick={handlePrevMonth} className="ml-2 text-3xl rounded" />
        <MdOutlineKeyboardArrowRight onClick={handleNextMonth} className="text-3xl rounded" />
      </button>
      
      <h2 className="text-2xl font-normal px-2 pt-3">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h2>

      <button className="flex ml-80 gap-4 pt-5">
        <IoSearchOutline className="text-2xl" />
        <MdOutlineContactSupport className="text-2xl" />
        <IoSettingsOutline className="text-2xl" />
      </button>

      <div className="relative inline-block text-left pt-3">
        <button
          onClick={toggleDropdown}
          className="ml-4 border-2 text-2xl font-normal border-solid rounded-sm px-2 py-1 flex items-center justify-between w-30"
        >
          {selected}
          <ChevronDown className="ml-2" size={20} />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {dropdownOptions.map((option) => (
                <div
                  key={option.label}
                  onClick={() => handleSelect(option.label)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="flex gap-6 pt-4 text-2xl ml-6">
        <span>
          <SlCalender />
        </span>
        <span>
          <MdOutlineAddTask />
        </span>
      </button>
    </div>
  );
}