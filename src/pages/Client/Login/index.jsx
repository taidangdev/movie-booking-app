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
      localStorage.setItem('USER_LOGIN', JSON.stringify(res.content));
      message.success('Đăng nhập thành công! Chào mừng trở lại.');
      navigate('/');
      window.location.reload(); 
    } catch (error) {
      message.error(error.response?.data?.content || 'Tài khoản hoặc Mật khẩu không đúng!');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Tính năng Responsive Box Model được khai báo className: form-container bên CSS */}
      <div 
        className="form-container" 
        style={{ 
          margin: '80px auto', 
          padding: 40, 
          border: '1px solid #e8e8e8', 
          borderRadius: 12, 
          background: '#fff', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)' 
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 10, fontSize: 26, color: '#fa541c', fontWeight: 800 }}>MÀN HÌNH ĐĂNG NHẬP</h2>
        <p style={{ textAlign: 'center', marginBottom: 30, color: '#888' }}>Truy cập vào dịch vụ của Hệ thống Phim</p>
        
        {/* AntD Form hỗ trợ responsive cực tốt nếu ta bọc khối width: 100% */}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Tên Đăng nhập" name="taiKhoan" rules={[{ required: true, message: 'Vui lòng điền tài khoản!' }]}>
            <Input size="large" autoFocus style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Mật khẩu bảo mật" name="matKhau" rules={[{ required: true, message: 'Mật khẩu là bắt buộc' }]}>
            <Input.Password size="large" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ marginTop: 40 }}>
            {/* Sử dụng thuộc tính block width mượt mà */}
            <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ height: 50, fontSize: 18, fontWeight: 'bold' }}>
              VÀO RẠP CHIẾU
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: 25 }}>
          Chưa có tài khoản? <NavLink to="/dangky" style={{ color: '#fa541c', fontWeight: 600 }}>Tạo tài khoản</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
