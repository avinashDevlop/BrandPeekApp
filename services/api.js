import axios from 'axios';

const API_BASE_URL = 'https://brandpeek-22360-default-rtdb.firebaseio.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchBrands = async () => {
  try {
    const response = await api.get('/brands.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

export default {
  fetchBrands,
};