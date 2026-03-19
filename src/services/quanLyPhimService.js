import axiosClient from './configURL';

export const quanLyPhimService = {
  layDanhSachPhim: (maNhom = 'GP01') => {
    return axiosClient.get(`/QuanLyPhim/LayDanhSachPhim?maNhom=${maNhom}`);
  },
  themPhimUploadHinh: (formData) => {
    return axiosClient.post('/QuanLyPhim/ThemPhimUploadHinh', formData);
  },
  capNhatPhimUpload: (formData) => {
    return axiosClient.post('/QuanLyPhim/CapNhatPhimUpload', formData);
  },
  xoaPhim: (maPhim) => {
    return axiosClient.delete(`/QuanLyPhim/XoaPhim?maPhim=${maPhim}`);
  },
  layThongTinPhim: (maPhim) => {
    return axiosClient.get(`/QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`);
  }
};
