import React, { useEffect, useState } from 'react';
import { Tabs, Form, Input, Button, message, Table, Tag } from 'antd';
import { quanLyNguoiDungService } from '../../../services/quanLyNguoiDungService';
import dayjs from 'dayjs';

const Profile = () => {
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hook vòng gọi call Server API Fetch bằng Token để móc Profile ra
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // API của CyberSoft cho route Thông Tin Tài Khoản có thể xài Post lấy dữ liệu dựa trên cục Token giấu trong Header 
      const res = await quanLyNguoiDungService.thongTinTaiKhoan();
      setUserInfo(res.content);
      
      // Vát toàn bộ Data server Fill gọn lên các input Form Update
      form.setFieldsValue({
        taiKhoan: res.content.taiKhoan,
        matKhau: res.content.matKhau,
        hoTen: res.content.hoTen,
        email: res.content.email,
        soDT: res.content.soDT,
        maLoaiNguoiDung: res.content.maLoaiNguoiDung,
        maNhom: res.content.maNhom, // GP01 là chuẩn
      });
    } catch (error) {
       message.error('Phiên đăng nhập mất hiệu lực, xin vui lòng kiểm tra tại Trang Chủ Đăng Nhập!');
    }
    setLoading(false);
  };

  const onUpdateProfileInfo = async (values) => {
    try {
      await quanLyNguoiDungService.capNhatNguoiDung(values);
      message.success('Chỉnh Sửa/Lưu trữ Dấu Vân Dữ Liệu Thông Tin tốt đẹp!');
      fetchProfile(); // Hook cập nhật ngược lại mới
    } catch (error) {
       message.error(error.response?.data?.content || 'Chỉnh Sửa Server trục trặc');
    }
  };

  // Cấu hình Table hiển thị Vé
  const datVeColumns = [
    { 
      title: '🎥 Phim đã múc rạp', 
      dataIndex: 'tenPhim', 
      key: 'tenPhim', 
      render: (text) => <b style={{ color: '#fa541c', fontSize: 16 }}>{text}</b> 
    },
    { 
      title: 'Thời gian xuất hoá đơn', 
      dataIndex: 'ngayDat', 
      key: 'ngayDat', 
      render: (text) => dayjs(text).format('HH:mm - DD/MM/YYYY') 
    },
    { 
      title: 'Chi phí tổn thất', 
      dataIndex: 'giaVe', 
      key: 'giaVe', 
      render: (gia, record) => <span style={{ fontWeight: 'bold' }}>{(gia * record.danhSachGhe.length).toLocaleString()} ₫</span> 
    },
    { 
      title: 'Mã Ghế x Chi nhánh', 
      dataIndex: 'danhSachGhe', 
      key: 'danhSachGhe', 
      render: (gheMangs) => (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 5}}>
          {gheMangs.map((ghe, i) => (
            <Tag color="green" key={i}> {ghe.tenHeThongRap} (Ghế {ghe.tenGhe}) </Tag>
          ))}
        </div>
      ) 
    }
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0', fontSize: 20 }}>Đang load User Metadata...</div>;
  if (!userInfo) return <div style={{textAlign: 'center', margin: '150px 0', color: 'red'}}>Oops! Bạn đang theo dõi Hồ Sơ của ai thế? Bạn cần thẻ Căn Cước nhé ^_^ (Đăng nhập đi!)</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '60px auto', background: '#fff', padding: '40px 50px', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
        <img src={`https://ui-avatars.com/api/?name=${userInfo.taiKhoan}&background=fa541c&color=fff&size=80`} alt="ava" style={{ borderRadius: '50%' }} />
        <div>
           <h2 style={{ fontSize: 28, margin: 0 }}>CÁ NHÂN TRANH {userInfo.hoTen?.toUpperCase()}</h2>
           <p style={{ color: '#888', margin: '5px 0 0 0' }}>Quyền hạn: {userInfo.maLoaiNguoiDung}</p>
        </div>
      </div>

      <Tabs defaultActiveKey="2" size="large">
        
        {/* TAB HOÀN THIỆN TT */}
        <Tabs.TabPane tab="ĐIỀU CHỈNH THÔNG TIN" key="1">
          <Form form={form} layout="vertical" onFinish={onUpdateProfileInfo} style={{ maxWidth: 500, marginTop: 30 }}>
            <Form.Item label="Identity Tài khoản (Chết)" name="taiKhoan">
              <Input disabled size="large" />
            </Form.Item>
            <Form.Item label="Pass code Bảo mật" name="matKhau">
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item label="Danh Xưng" name="hoTen">
               <Input size="large" />
            </Form.Item>
            <Form.Item label="Thư ngỏ Email" name="email">
               <Input size="large" />
            </Form.Item>
            <Form.Item label="Mã Số Phone" name="soDT">
               <Input size="large" />
            </Form.Item>
            <Form.Item name="maLoaiNguoiDung" hidden><Input /></Form.Item>
            <Form.Item name="maNhom" hidden><Input /></Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" style={{ width: '100%', height: 50 }}>
                XÁC NHẬN LƯU DATABASE
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>

        {/* TAB VÉ */}
        <Tabs.TabPane tab="LỊCH SỬ NÉM TIỀN (VÉ CHỐT)" key="2">
           <Table 
             dataSource={userInfo.thongTinDatVe} 
             columns={datVeColumns} 
             rowKey="maVe" 
             style={{ marginTop: 20 }}
             pagination={{ pageSize: 5 }}
             bordered
           />
        </Tabs.TabPane>
        
      </Tabs>
    </div>
  );
};

export default Profile;
