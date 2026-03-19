import axiosClient from './configURL';

export const quanLyNguoiDungService = {
  // === PHASE 4 (Admin) ===
  layDanhSachNguoiDung: (tuKhoa = '', maNhom = 'GP01') => {
    if (tuKhoa.trim() !== '') return axiosClient.get(`/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}&tuKhoa=${tuKhoa}`);
    return axiosClient.get(`/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=${maNhom}`);
  },
  themNguoiDung: (thongTinNguoiDung) => axiosClient.post('/QuanLyNguoiDung/ThemNguoiDung', thongTinNguoiDung),
  capNhatNguoiDung: (thongTinNguoiDung) => axiosClient.post('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', thongTinNguoiDung),
  xoaNguoiDung: (taiKhoan) => axiosClient.delete(`/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`),

  // === PHASE 5 (Client) ===
  dangNhap: (thongTinDangNhap) => axiosClient.post('/QuanLyNguoiDung/DangNhap', thongTinDangNhap),
  dangKy: (thongTinDangKy) => axiosClient.post('/QuanLyNguoiDung/DangKy', thongTinDangKy),
  thongTinTaiKhoan: () => axiosClient.post('/QuanLyNguoiDung/ThongTinTaiKhoan')
};
