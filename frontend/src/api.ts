import axios from 'axios';
import { ListElement, ListElementFormData } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';
console.log('API Base URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchElements = async (): Promise<ListElement[]> => {
  try {
    console.log('Fetching elements from:', `${API_BASE_URL}/elements/`);
    const response = await api.get('/elements/');
    console.log('API Response:', response.data);
    if (!Array.isArray(response.data)) {
      console.error('API Response is not an array:', response.data);
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching elements:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
    }
    return [];
  }
};

export const createElement = async (data: ListElementFormData): Promise<ListElement> => {
  const response = await api.post('/elements/', data);
  return response.data;
}; 