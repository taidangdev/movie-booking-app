import axiosClient from './configURL';

export const quanLyRapService = {
  layThongTinHeThongRap: () => {
    return axiosClient.get('/QuanLyRap/LayThongTinHeThongRap');
  },
  layThongTinCumRapTheoHeThong: (maHeThongRap) => {
    return axiosClient.get(`/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`);
  },
  layThongTinLichChieuPhim: (maPhim) => {
    return axiosClient.get(`/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`);
  }
};
