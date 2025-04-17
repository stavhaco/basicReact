import axios from 'axios';
import { ListElement, ListElementFormData } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchElements = async (): Promise<ListElement[]> => {
  const response = await api.get('/elements/');
  return response.data;
};

export const createElement = async (data: ListElementFormData): Promise<ListElement> => {
  const response = await api.post('/elements/', data);
  return response.data;
}; 