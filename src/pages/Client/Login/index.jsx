import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, NavLink } from 'react-router-dom';
import { quanLyNguoiDungService } from '../../../services/quanLyNguoiDungService';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await quanLyNguoiDungService.dangNhap(values);
      // Lưu toàn bộ Object thông tin User (gồm Token) vào LocalStorage an toàn
      localStorage.setItem('USER_LOGIN', JSON.stringify(res.content));
      message.success('Đăng nhập thành công! Chào mừng trở lại.');
      navigate('/');
      
      // Reload nhanh để các API lập tức gắn Authorization Token vào Header (Bypass)
      window.location.reload(); 
    } catch (error) {
      message.error(error.response?.data?.content || 'Tài khoản hoặc Mật khẩu không đúng!');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 450, margin: '100px auto', padding: 40, border: '1px solid #e8e8e8', borderRadius: 12, background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 10, fontSize: 30, color: '#fa541c' }}>ĐĂNG NHẬP</h2>
      <p style={{ textAlign: 'center', marginBottom: 30, color: '#888' }}>Truy cập vào dịch vụ của Hệ thống Phim</p>
      
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="TaiKhoan / Tên Đăng nhập" name="taiKhoan" rules={[{ required: true, message: 'Nhập tên tài khoản' }]}>
          <Input size="large" autoFocus />
        </Form.Item>
        <Form.Item label="Mật khẩu bảo vệ" name="matKhau" rules={[{ required: true, message: 'Nhập mật khẩu truy cập' }]}>
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item style={{ marginTop: 30 }}>
          <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ height: 50, fontSize: 18 }}>
            VÀO RẠP CHIẾU
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        Chưa có tài khoản? <NavLink to="/dangky" style={{ color: '#fa541c' }}>Đăng ký ngay thôi</NavLink>
      </div>
    </div>
  );
};
export default Login;
