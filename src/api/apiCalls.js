import axios from 'axios';

const api = axios.create({
  baseURL: 'http://codeart.cc',
  mode: 'no-cors',
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
