// services/index.js
import axios from 'axios';

// Create an axios instance with base configuration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Update this to match your actual API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API endpoints
export const API_ENDPOINTS = {
  getAllEmployee: '/employees', // Update this to match your actual endpoint
  getAllTask: '/tasks'         // Update this to match your actual endpoint
};