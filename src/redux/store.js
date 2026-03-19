import { configureStore } from '@reduxjs/toolkit';

// Import các reducer (slice)
import quanLyPhimReducer from './slices/quanLyPhimSlice';

// Cấu hình kho lưu trữ trung tâm của Store React Project
export const store = configureStore({
  reducer: {
    // Đặt tên state lớn là: quanLyPhim tương chiếu đến file slice
    quanLyPhim: quanLyPhimReducer,
  },
  // React Devtools sẽ tự động hook vào trình duyệt
});
