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
      const payload = { ...values, maNhom: 'GP01' };
      await quanLyNguoiDungService.dangKy(payload);
      message.success('Đăng ký Profile thành công! Đăng nhập để sử dụng tiếp dịch vụ');
      navigate('/dangnhap');
    } catch (error) {
      if(error.response) {
        message.error(error.response.data.content || 'Dữ liệu đăng ký không vẹn toàn!');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Tính năng Responsive Box Model được khai báo className: form-container bên CSS */}
      <div 
        className="form-container" 
        style={{ 
          margin: '50px auto', 
          padding: 40, 
          border: '1px solid #e8e8e8', 
          borderRadius: 12, 
          background: '#fff', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)' 
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 10, fontSize: 26, color: '#fa541c', fontWeight: 800 }}>THAM GIA ĐẶT VÉ</h2>
        <p style={{ textAlign: 'center', marginBottom: 30, color: '#888' }}>Mở tài khoản nhanh trong vòng vài giây</p>
        
        {/* AntD Form - Các thuộc tính Inputs đều được bọc 100% width tương tự Login */}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Nhập chọn tài khoản" name="taiKhoan" rules={[{ required: true }]}><Input size="large" style={{width: '100%'}}/></Form.Item>
          <Form.Item label="Gài mật khẩu" name="matKhau" rules={[{ required: true }]}><Input.Password size="large" style={{width: '100%'}}/></Form.Item>
          <Form.Item label="Họ Tên đệm đầy đủ" name="hoTen" rules={[{ required: true }]}><Input size="large" style={{width: '100%'}}/></Form.Item>
          <Form.Item label="E-mail xác nhận" name="email" rules={[{ required: true, type: 'email' }]}><Input size="large" style={{width: '100%'}}/></Form.Item>
          <Form.Item label="Số Phone nhắn tin" name="soDt" rules={[{ required: true }]}><Input size="large" style={{width: '100%'}}/></Form.Item>
          
          <Form.Item style={{ marginTop: 40 }}>
            {/* Sử dụng thuộc tính block width mượt mà */}
            <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ height: 50, fontSize: 18, fontWeight: 'bold', width: '100%' }}>
              LẬP TÀI KHOẢN NGAY
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: 25 }}>
          Bạn đã có acc rồi? <NavLink to="/dangnhap" style={{ color: '#fa541c', fontWeight: 600 }}>Quay lại Đăng Nhập</NavLink>
        </div>
      </div>
    </div>
  );
};
export default Register;
