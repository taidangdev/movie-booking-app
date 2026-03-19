import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Form, Select, message, Popconfirm } from 'antd';
import { quanLyNguoiDungService } from '../../../services/quanLyNguoiDungService';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async (tuKhoa = '') => {
    setLoading(true);
    try {
      const result = await quanLyNguoiDungService.layDanhSachNguoiDung(tuKhoa);
      setUsers(result.content || []);
    } catch (error) {
      if(error.response) message.error('Lỗi khi tải danh sách người dùng!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (taiKhoan) => {
    try {
      await quanLyNguoiDungService.xoaNguoiDung(taiKhoan);
      message.success('Xóa thông tin tài khoản thành công');
      fetchUsers();
    } catch (error) {
       message.error(error.response?.data?.content || 'Xóa thất bại do liên quan dữ liệu khác');
    }
  };

  const showModal = (record = null) => {
    setIsModalOpen(true);
    if (record) {
      setIsEdit(true);
      form.setFieldsValue({ ...record, maNhom: 'GP01' });
    } else {
      setIsEdit(false);
      form.resetFields();
      form.setFieldsValue({ maNhom: 'GP01', maLoaiNguoiDung: 'KhachHang' });
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        await quanLyNguoiDungService.capNhatNguoiDung(values);
        message.success('Cập nhật tài khoản người dùng thành công!');
      } else {
        await quanLyNguoiDungService.themNguoiDung(values);
        message.success('Thêm tài khoản người dùng mới thành công!');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      if(error.response) {
        message.error(error.response.data.content || 'Xử lý thất bại');
      }
    }
  };

  const columns = [
    { title: 'Tài khoản', dataIndex: 'taiKhoan', key: 'taiKhoan', width: '15%' },
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số ĐT', dataIndex: 'soDT', key: 'soDT' },
    { 
      title: 'Quyền (Phân Quyền)', 
      dataIndex: 'maLoaiNguoiDung', 
      key: 'maLoaiNguoiDung',
      render: (text) => <span style={{ color: text === 'QuanTri' ? 'red' : 'blue', fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm title={`Bạn chắc chắn xóa tài khoản ${record.taiKhoan}?`} onConfirm={() => handleDelete(record.taiKhoan)}>
             <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2 style={{ paddingBottom: 20 }}>Quản Lý Dữ Liệu Khách Hàng (GP01)</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => showModal()}>
          Tạo Account Mới
        </Button>
        <Search 
          placeholder="Lọc User..." 
          onSearch={(val) => fetchUsers(val)} 
          style={{ width: 350 }} 
          enterButton 
          size="large" 
        />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="taiKhoan" 
        loading={loading} 
        bordered 
        pagination={{pageSize: 8}}
      />

      <Modal 
        title={isEdit ? "CẬP NHẬT TÀI KHOẢN" : "THÊM TÀI KHOẢN MỚI"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        okText={isEdit ? "Lưu lại" : "Khởi tạo"}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="taiKhoan" label="Tài khoản đăng nhập" rules={[{ required: true }]}>
            <Input disabled={isEdit} />
          </Form.Item>
          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true }]}>
             <Input.Password />
          </Form.Item>
          <Form.Item name="hoTen" label="Tên lót & Tên gọi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Hộp thư E-mail liên hệ" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="soDT" label="Số điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="maLoaiNguoiDung" label="Vị trí Người dùng" rules={[{ required: true }]}>
            <Select>
              <Option value="KhachHang">Chỉ là Khách Hàng</Option>
              <Option value="QuanTri">Cấp Quản Trị Hệ Thống</Option>
            </Select>
          </Form.Item>
          <Form.Item name="maNhom" hidden><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
