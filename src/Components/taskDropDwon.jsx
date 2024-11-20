import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaskTitleSelector = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="taskTitle"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Task Title
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <SelectValue placeholder="Add guest" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="meeting">Team Meeting</SelectItem>
            <SelectItem value="presentation">Client Presentation</SelectItem>
            <SelectItem value="deadline">Project Deadline</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectItem value="review">Code Review</SelectItem>
            <SelectItem value="planning">Sprint Planning</SelectItem>
            <SelectItem value="standup">Daily Standup</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectItem value="training">Training Session</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskTitleSelector;