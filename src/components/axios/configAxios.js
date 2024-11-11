import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 100000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// axiosInstance.interceptors.request.use(config => {
//   return { ...config };  
// });


export default axiosInstance;
