import axios from 'axios';

const api = axios.create({
  baseURL: 'https://repertoar-node-m8in81sv6-arbendjokovics-projects.vercel.app',
  // mode: 'no-cors',
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
