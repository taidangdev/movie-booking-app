import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, NavLink } from 'react-router-dom';
import { quanLyNguoiDungService } from '../../../services/quanLyNguoiDungService';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Ép cố định mã nhóm để vào hệ thống được chấm điểm (GP01)
      const payload = { ...values, maNhom: 'GP01' };
      await quanLyNguoiDungService.dangKy(payload);
      
      message.success('Đăng ký Profile thành công! Đăng nhập để sử dụng tiếp dịch vụ');
      navigate('/dangnhap');
    } catch (error) {
      if(error.response) {
        message.error(error.response.data.content || 'Đăng ký gặp trục trặc, vui lòng kiểm tra lại');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 550, margin: '80px auto', padding: 40, border: '1px solid #e8e8e8', borderRadius: 12, background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 10, fontSize: 30, color: '#fa541c' }}>THAM GIA RẠP CHIẾU</h2>
      <p style={{ textAlign: 'center', marginBottom: 30, color: '#888' }}>Mở tài khoản mua vé trong vòng vài giây</p>
      
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Nhập chọn tài khoản" name="taiKhoan" rules={[{ required: true }]}><Input size="large" /></Form.Item>
        <Form.Item label="Gài mật khẩu" name="matKhau" rules={[{ required: true }]}><Input.Password size="large" /></Form.Item>
        <Form.Item label="Họ Tên đệm đầy đủ" name="hoTen" rules={[{ required: true }]}><Input size="large" /></Form.Item>
        <Form.Item label="E-mail (Cho E-ticket)" name="email" rules={[{ required: true, type: 'email' }]}><Input size="large" /></Form.Item>
        <Form.Item label="Số Phone nhắn tin" name="soDt" rules={[{ required: true }]}><Input size="large" /></Form.Item>
        
        <Form.Item style={{ marginTop: 30 }}>
          <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ height: 50, fontSize: 18 }}>
            LẬP TÀI KHOẢN NGAY
          </Button>
        </Form.Item>
      </Form>
      
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        Bạn có thẻ xem phim trước đó? <NavLink to="/dangnhap" style={{ color: '#fa541c' }}>Đăng Nhập Thôi</NavLink>
      </div>
    </div>
  );
};
export default Register;
