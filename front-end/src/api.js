// src/api.js
const API_URL = 'http://localhost:3001/api';

export const connectToAPI = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:3001/api${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('No se pudo conectar a la API:', error);
      return [];
    }
  };  
