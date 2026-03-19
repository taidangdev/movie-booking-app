import React, { useState, useEffect } from 'react';
import { Form, Button, Select, DatePicker, InputNumber, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { quanLyRapService } from '../../../services/quanLyRapService';
import { quanLyDatVeService } from '../../../services/quanLyDatVeService';

const { Option } = Select;

const ShowTime = () => {
  const { idFilm } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [heThongRap, setHeThongRap] = useState([]);
  const [cumRap, setCumRap] = useState([]);

  // Fetch danh mục cụm logo Rạp
  useEffect(() => {
    const fetchHeThongRap = async () => {
      try {
        const res = await quanLyRapService.layThongTinHeThongRap();
        setHeThongRap(res.content || []);
      } catch (err) {}
    };
    fetchHeThongRap();
  }, []);

  // Khi chọn rạp (VD CGV), fetch ra các chi nhánh (CGV Sư Vạn Hạnh, Vincom...)
  const handleChangeHeThongRap = async (value) => {
    try {
      const res = await quanLyRapService.layThongTinCumRapTheoHeThong(value);
      setCumRap(res.content || []);
      // Reset Select option thứ 2
      form.setFieldsValue({ maRap: undefined });
    } catch(err) {}
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        maPhim: Number(idFilm),
        ngayChieuGioChieu: values.ngayChieuGioChieu.format('DD/MM/YYYY hh:mm:ss'),
        maRap: values.maRap,
        giaVe: values.giaVe
      };
      await quanLyDatVeService.taoLichChieu(payload);
      message.success('Tạo lịch chiếu thành công rực rỡ!');
      navigate('/admin/films');
    } catch (error) {
      message.error(error.response?.data?.content || 'Không thể thao tác tạo lịch chiếu lúc này');
    }
  };

  return (
    <div style={{ padding: '0 20px' }}>
      <h2 style={{ paddingBottom: 20 }}>Cấu Nhật Lịch Chiếu - Mã Phim: {idFilm}</h2>
      <Form 
        form={form} 
        layout="horizontal" 
        labelCol={{span: 4}} 
        wrapperCol={{span: 12}} 
        onFinish={onFinish} 
        style={{ marginTop: 30 }}
      >
        <Form.Item label="Hệ thống rạp" name="heThongRap" rules={[{ required: true, message: 'Bắt buộc chọn hệ thống Rạp!' }]}>
          <Select placeholder="Chọn Logo hệ thống rạp" onChange={handleChangeHeThongRap}>
            {heThongRap.map(ht => <Option key={ht.maHeThongRap} value={ht.maHeThongRap}>{ht.tenHeThongRap}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item label="Cụm rạp chi nhánh" name="maRap" rules={[{ required: true, message: 'Cụm rạp là bắt buộc' }]}>
          <Select placeholder="Lựa chọn một hệ thống rạp trước để hiển thị Cụm...">
            {cumRap.map(cr => <Option key={cr.maCumRap} value={cr.maCumRap}>{cr.tenCumRap}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item label="Ngày chiếu (Giờ chiếu)" name="ngayChieuGioChieu" rules={[{ required: true, message: 'Bắt buộc chọn giờ chiếu' }]}>
          <DatePicker showTime format="DD/MM/YYYY hh:mm:ss" placeholder="Tiến hành chọn giờ" />
        </Form.Item>

        <Form.Item label="Giá vé Rạp (VND)" name="giaVe" rules={[{ required: true }]}>
          <InputNumber min={75000} max={200000} style={{ width: '100%' }} placeholder="Khoảng 75,000 -> 200,000đ" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type="primary" htmlType="submit" size="large">Xác nhận Đẩy Lên CSDL</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ShowTime;
