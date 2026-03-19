import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLayDanhSachPhim } from '../../../redux/slices/quanLyPhimSlice';
import { quanLyPhimService } from '../../../services/quanLyPhimService';

const { Search } = Input;

const Films = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Rút trích danh sách phim trực tiếp từ Redux Store
  const { mangPhim, isLoading } = useSelector((state) => state.quanLyPhim);
  const [searchTerm, setSearchTerm] = useState('');

  // Call API Redux ngay khi mở trang
  useEffect(() => {
    dispatch(fetchLayDanhSachPhim('GP01'));
  }, [dispatch]);

  // Handle Event: Xóa Phim
  const handleDelete = async (maPhim) => {
    try {
      await quanLyPhimService.xoaPhim(maPhim);
      message.success(`Đã xóa phim mã: ${maPhim}`);
      // Dispatch lại một luồng mới gọi FetchList mới nhất update về UI (Store)
      dispatch(fetchLayDanhSachPhim('GP01'));
    } catch (error) {
      if(error.response) {
        message.error(error.response.data.content || 'Xóa phim thất bại (Có thể phim này đã được đặt vé)');
      }
    }
  };

  // Filter mảng phim dưới Front-end nếu gõ Text Search
  const filterData = mangPhim?.filter(item => 
    item.tenPhim?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'Mã phim',
      dataIndex: 'maPhim',
      key: 'maPhim',
      width: '10%',
      sorter: (a, b) => a.maPhim - b.maPhim,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'hinhAnh',
      key: 'hinhAnh',
      width: '15%',
      // Thẻ img tự fallback sang ảnh trống nếu link die
      render: (text) => (
        <img 
          src={text} 
          alt="film_cover" 
          style={{ width: 60, height: 80, objectFit: 'cover', borderRadius: '4px' }}
          onError={(e) => { e.target.src = 'https://picsum.photos/60/80'; }} 
        />
      )
    },
    {
      title: 'Tên phim',
      dataIndex: 'tenPhim',
      key: 'tenPhim',
      width: '25%',
      sorter: (a, b) => a.tenPhim.localeCompare(b.tenPhim),
      render: (text) => <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{text}</span>
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
      width: '30%',
      render: (text) => text?.length > 70 ? text.substring(0, 70) + '...' : text
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/admin/films/edit/${record.maPhim}`)}
          />
          <Popconfirm
            title={`Chắc chắn xóa phim "${record.tenPhim}"?`}
            onConfirm={() => handleDelete(record.maPhim)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button 
            style={{ backgroundColor: '#52c41a', color: '#fff' }} 
            icon={<CalendarOutlined />} 
            onClick={() => navigate(`/admin/films/showtime/${record.maPhim}`)}
          >
            Tạo lịch
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Quản Lý Kho Phim</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/admin/films/addnew')}
        >
          Thêm Phim Mới
        </Button>
        <Search 
          placeholder="Nhập phần tên phim cần tìm..." 
          allowClear 
          enterButton="Tìm Kiếm" 
          size="large" 
          style={{ width: 400 }}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <Table 
        columns={columns} 
        dataSource={filterData} 
        rowKey="maPhim"
        loading={isLoading}
        pagination={{ pageSize: 8 }} 
        bordered
      />
    </div>
  );
};

export default Films;
