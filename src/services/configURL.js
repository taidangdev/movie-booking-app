import axios from 'axios';

export const BASE_URL = 'https://movienew.cybersoft.edu.vn/api';

// Token test do bạn (Senior) cung cấp
const FALLBACK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NiIsIkhldEhhblN0cmluZyI6IjIwLzA4LzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc4NzE4NDAwMDAwMCIsIm5iZiI6MTc0OTkyMDQwMCwiZXhwIjoxNzg3MzMxNjAwfQ.LHRwhREY4d1ffiVJM8MhEjucrak9xpN3A-VsD7nTPJA';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosClient.interceptors.request.use(
  (config) => {
    // 1. Đặc tả quan trọng API Cybersoft: Mọi Request đều phải chèn Token Lớp (Dự án) vào header: TokenCybersoft
    config.headers.TokenCybersoft = FALLBACK_TOKEN;

    // 2. Chặn Request, kiểm tra ở dưới LocalStorage xem User có đang đăng nhập không
    const userLocal = localStorage.getItem('USER_LOGIN');
    if (userLocal) {
      const parsedUser = JSON.parse(userLocal);
      // Gán vào Header quyền truy cập riêng của User đó (Chuẩn Bearer)
      if(parsedUser.accessToken) {
        config.headers.Authorization = `Bearer ${parsedUser.accessToken}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Lỗi 401: Yêu cầu thẩm quyền bị từ chối.');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
