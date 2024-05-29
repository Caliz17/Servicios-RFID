// api.js
const BASE_URL = 'http://localhost:3001/api';

export const connectToAPI = async (endpoint, data) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    throw new Error(`HTTP error! ${error}`);
  }
};