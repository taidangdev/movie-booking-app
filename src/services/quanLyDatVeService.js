import axiosClient from './configURL';

export const quanLyDatVeService = {
  // Admin: Tạo Lịch 
  taoLichChieu: (thongTinLichChieu) => {
    return axiosClient.post('/QuanLyDatVe/TaoLichChieu', thongTinLichChieu);
  },
  
  // Client: Đổ lưới dữ liệu Phòng vé (Lấy list ghế VIP, Trống...)
  layDanhSachPhongVe: (maLichChieu) => {
    return axiosClient.get(`/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`);
  },

  // Client: Duyệt mua Vé (Checkout)
  datVe: (thongTinDatVe) => {
    return axiosClient.post('/QuanLyDatVe/DatVe', thongTinDatVe);
  }
};
