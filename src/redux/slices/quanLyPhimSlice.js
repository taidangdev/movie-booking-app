import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quanLyPhimService } from '../../services/quanLyPhimService';

// BƯỚC 1: Khởi tạo async Thunk đóng vai trò trung gian chứa logic bất đồng bộ gọi API
export const fetchLayDanhSachPhim = createAsyncThunk(
  'quanLyPhim/fetchLayDanhSachPhim',
  async (maNhom, { rejectWithValue }) => {
    try {
      const result = await quanLyPhimService.layDanhSachPhim(maNhom);
      // Backend CyberSoft thường trả về Array phim nguyên thủy bọc trong key `content`
      return result.content || result; 
    } catch (error) {
      // Bắt lỗi truyền từ response server xuống
      return rejectWithValue(error.response?.data?.content || error.message || 'Lỗi hệ thống');
    }
  }
);

// BƯỚC 2: Định kiện các giá trị state ban đầu.
const initialState = {
  mangPhim: [],
  isLoading: false,
  error: null,
};

// BƯỚC 3: Tạo Slice quản lý Phim tại Client
const quanLyPhimSlice = createSlice({
  name: 'quanLyPhim',  // Đây là định danh nội bộ trong devtools
  initialState,
  reducers: {
    // Các Action trực tiếp, Đồng bộ nội tuyến không API
  },
  // Bắt 3 trạng thái của Thunk (Pending/Fulfilled/Rejected)
  extraReducers: (builder) => {
    builder
      // 1. Khi đang đợi kết quả Request
      .addCase(fetchLayDanhSachPhim.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // 2. Khi Request thành công tốt đẹp
      .addCase(fetchLayDanhSachPhim.fulfilled, (state, action) => {
        state.isLoading = false;
        // Gán mảng dữ liệu lấy từ server đè vào mangPhim
        state.mangPhim = action.payload; 
      })
      // 3. Khi Request gặp lỗi rủi ro
      .addCase(fetchLayDanhSachPhim.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
      });
  },
});

export default quanLyPhimSlice.reducer;
