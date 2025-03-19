// API configuration
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://bingo-api-94i2.onrender.com'
      : 'http://localhost:8000'),
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 
    (process.env.NODE_ENV === 'production'
      ? 'wss://bingo-api-94i2.onrender.com'
      : 'ws://localhost:8000')
}

export default config;
