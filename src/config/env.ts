/**
 * Environment configuration for the application
 */

// Define environment-specific API URLs
const API_URL = {
  development: 'http://localhost:8000',
  production: process.env.NEXT_PUBLIC_API_URL || 'https://bingo-api-94i2.onrender.com',
  test: 'http://localhost:8000'
};

// Define environment-specific WebSocket URLs
const WS_URL = {
  development: 'ws://localhost:8000',
  production: process.env.NEXT_PUBLIC_WS_URL || 'wss://bingo-api-94i2.onrender.com',
  test: 'ws://localhost:8000'
};

// Helper to get the current environment
const getEnvironment = () => {
  return (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
};

// Helper to get the correct API URL for the current environment
export const getApiUrl = () => {
  const env = getEnvironment();
  return API_URL[env];
};

// Helper to get the correct WebSocket URL for the current environment
export const getWsUrl = () => {
  const env = getEnvironment();
  return WS_URL[env];
};

// Environment checks
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';
