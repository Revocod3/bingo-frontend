// API configuration
const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://bingo-api-94i2.onrender.com'  // Your Render deployed API URL
    : 'http://localhost:8000',  // Local development URL  
}

export default config;
