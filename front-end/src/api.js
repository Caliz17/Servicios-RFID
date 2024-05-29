// api.js
export const connectToAPI = async (endpoint, data, method = 'GET') => {
  const baseUrl = 'http://localhost:3001/api';
  const url = `${baseUrl}${endpoint}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: method !== 'GET' ? JSON.stringify(data) : undefined
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error en la solicitud a la API:', error);
    throw error;
  }
};
