import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Rate, Tabs, Button, Tag } from 'antd';
import { quanLyRapService } from '../../../services/quanLyRapService';
import dayjs from 'dayjs';

const MovieDetail = () => {
  const { maPhim } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Lưu cục Data to bự gồm Thông tin phim và cả mảng Lịch Rạp Phim
  const [phimInfo, setPhimInfo] = useState(null);

  useEffect(() => {
    // Scroll mượt lên top mỗi lần User đổi phim khác
    window.scrollTo(0, 0); 
    fetchData();
  }, [maPhim]);

  const fetchData = async () => {
    try {
      // API đặc tả để trích xuất Phim kèm Lịch Rạp nằm ở QuanLyRap
      const res = await quanLyRapService.layThongTinLichChieuPhim(maPhim);
      setPhimInfo(res.content);
    } catch (error) {
      console.log('Lỗi API lấy lịch chiếu', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '150px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!phimInfo) {
    return <div style={{ textAlign: 'center', marginTop: 100, fontSize: 20 }}>Dữ liệu phim không tồn tại trên Server!</div>;
  }

  // --- HÀM THIẾT KẾ CỤM TABS: CHUỖI RẠP -> TẦNG CHI NHÁNH -> GIỜ CHIẾU ---
  const renderTabs = () => {
    // Format đúng kiểu dùng items={} của Ant Design Tabs
    const heThongRapItems = phimInfo.heThongRapChieu?.map((htr, index) => {
      return {
        key: String(index),
        // Menu Cột Bên Trái (VD: Logo CGV - CGV)
        label: (
          <div style={{ display: 'flex', alignItems: 'center', width: 150 }}>
            <img src={htr.logo} alt="logo" style={{ width: 45, height: 45, marginRight: 15, borderRadius: '50%' }} />
            <span style={{ fontWeight: 600, fontSize: 16 }}>{htr.tenHeThongRap}</span>
          </div>
        ),
        // Nội dung hiển thị bên Phải khi Click chọn Hệ thống rạp đó
        children: (
          <div style={{ padding: '0 20px', maxHeight: 500, overflowY: 'auto' }}>
            {htr.cumRapChieu?.map((cumRap, i2) => (
              <div key={i2} style={{ marginBottom: 30 }}>
                {/* 1. Thông tin Cụm chi nhánh */}
                <h4 style={{ fontSize: 18, color: '#fa541c' }}>{cumRap.tenCumRap}</h4>
                <p style={{ color: '#888', fontStyle: 'italic', marginBottom: 15 }}>{cumRap.diaChi}</p>
                
                {/* 2. Lưới Giờ chiếu các suất vé */}
                <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                  {cumRap.lichChieuPhim?.slice(0, 8).map((lich, i3) => (
                    
                    // NÚT ĐẶT VÉ TRỌNG ĐIỂM: Chuyển hướng đẩy người dùng tới trang /chitietphongve
                    <Button 
                      key={i3} 
                      type="default" 
                      style={{ background: '#f5f5f5', fontWeight: 'bold' }}
                      onClick={() => navigate(`/chitietphongve/${lich.maLichChieu}`)}
                    >
                      <span style={{ color: '#52c41a', fontSize: 16 }}>{dayjs(lich.ngayChieuGioChieu).format('HH:mm')}</span>
                      <span> - {dayjs(lich.ngayChieuGioChieu).format('DD/MM')}</span>
                    </Button>

                  ))}
                </div>
                <hr style={{ borderTop: '1px dashed #eee', margin: '20px 0' }} />
              </div>
            ))}
          </div>
        )
      };
    });

    return <Tabs tabPosition="left" items={heThongRapItems} />;
  };

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', paddingBottom: 80 }}>
      {/* KHU VỰC 1: POSTER BÌA RẠP KẾT HỢP BLUR BACKDROP */}
      <div style={{ 
        position: 'relative', 
        padding: '60px 0',
        background: `radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%), url(${phimInfo.hinhAnh})`,
        backgroundSize: 'cover',
        backgroundPosition: '100% 50%',
        backgroundBlendMode: 'darken'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 50, alignItems: 'center' }}>
          
          {/* Cột Trái chứa Ảnh Nhỏ Nét */}
           <img 
             src={phimInfo.hinhAnh} 
             alt={phimInfo.tenPhim} 
             style={{ width: 300, height: 420, objectFit: 'cover', borderRadius: 12, boxShadow: '0 0 35px rgba(255,255,255,0.15)' }} 
           />
           
          {/* Cột Phải chứa Nội Dung Giới Thiệu */}
           <div style={{ color: '#fff', flex: 1 }}>
              <p style={{ color: '#aaa', margin: 0, fontSize: 16 }}>
                 Lịch khởi chiếu dải ngân hà: {dayjs(phimInfo.ngayKhoiChieu).format('DD.MM.YYYY')}
              </p>
              
              <h1 style={{ fontSize: 45, fontWeight: 'bold', margin: '15px 0', textTransform: 'uppercase' }}>
                 {phimInfo.tenPhim}
              </h1>
              
              <div style={{ marginBottom: 25, display: 'flex', alignItems: 'center' }}>
                 <Rate disabled allowHalf value={phimInfo.danhGia / 2} /> 
                 <span style={{ marginLeft: 15, fontSize: 18, color: '#fadb14' }}>
                   ({phimInfo.danhGia}/10 Rating)
                 </span>
              </div>
              
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                 {phimInfo.dangChieu && <Tag color="green">ĐANG CHIẾU TOÀN QUỐC</Tag>}
                 {phimInfo.sapChieu && <Tag color="orange">SẮP PHÁT HÀNH</Tag>}
                 {phimInfo.hot && <Tag color="red">SIÊU HOT (CHÁY VÉ)</Tag>}
              </div>

              <h3 style={{ borderBottom: '1.5px solid #333', paddingBottom: 10, color: '#ccc' }}>Nội Dung Box Phim</h3>
              <p style={{ fontSize: 16, lineHeight: '1.7', color: '#ccc', textAlign: 'justify' }}>
                 {phimInfo.moTa}
              </p>
              
           </div>
        </div>
      </div>

      {/* KHU VỰC 2: LIST LỊCH MUA VÉ DẠNG TABS CÓ ĐỔ BÓNG */}
      <div style={{ 
        maxWidth: 1100, 
        margin: '-50px auto 0', 
        background: '#fff', 
        padding: '40px', 
        borderRadius: 12, 
        boxShadow: '0 -15px 30px rgba(0,0,0,0.6)', 
        position: 'relative',
        zIndex: 10 
      }}>
         <h2 style={{ textAlign: 'center', marginBottom: 40, fontSize: 32, color: '#fa541c', fontWeight: 800 }}>TRA CỨU SUẤT CHIẾU ONLINE</h2>
         
         {/* Render Cụm List Tab Danh sách */}
         {phimInfo.heThongRapChieu?.length > 0 ? renderTabs() : (
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#999', fontSize: 18 }}>
               Thành thật xin lỗi, nhà phân phối phim vẫn chưa sắp xếp lịch chiếu hoặc đã hết vé. Vui lòng quay lại sau!
            </div>
         )}
      </div>

    </div>
  );
};

export default MovieDetail;
