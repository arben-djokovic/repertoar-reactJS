import axios from 'axios';

const api = axios.create({
  baseURL: 'https://repertoar-node-js.vercel.app',
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
