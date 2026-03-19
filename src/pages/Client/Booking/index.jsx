import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quanLyDatVeService } from '../../../services/quanLyDatVeService';
import { Spin, Button, message, notification, Alert } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const Booking = () => {
  const { maLichChieu } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [phongVe, setPhongVe] = useState(null);
  
  // State quản lý danh sách các ghế đang chọn hiện tại (đồ lại Local Session)
  const [gheDangChon, setGheDangChon] = useState([]);

  useEffect(() => {
    fetchPhongVe();
  }, [maLichChieu]);

  const fetchPhongVe = async () => {
    try {
      const res = await quanLyDatVeService.layDanhSachPhongVe(maLichChieu);
      setPhongVe(res.content);
    } catch (error) {
      if(error.response) message.error('Hệ thống hết vé hoặc có lỗi đường truyền');
    }
    setLoading(false);
  };

  // Logic Click lên 1 Ghế Cứng của rạp
  const chonGhe = (ghe) => {
    // 1. Nếu ghế này đã có người book trên server, chặn click.
    if (ghe.daDat) return; 

    // 2. Xét ghế có đang ở trong mảng chọn không 
    const isExisted = gheDangChon.findIndex(g => g.maGhe === ghe.maGhe);

    if (isExisted !== -1) {
      // Bỏ trạng thái Chọn: Gạt thằng này văng ra khỏi mảng
      setGheDangChon(gheDangChon.filter(g => g.maGhe !== ghe.maGhe));
    } else {
      // Logic giới hạn: Phòng đầu cơ mua lậu (tối đa 12)
      if (gheDangChon.length >= 10) {
        message.warning('Mỗi người chỉ được đặt vé với số lượng tối đa là 10/bill!');
        return;
      }
      // Nhồi nó vào array Đang Chọn
      setGheDangChon([...gheDangChon, ghe]);
    }
  };

  const xuLyDatVe = async () => {
    // Check if hasn't selected anything
    if (gheDangChon.length === 0) {
      message.warning('Vui lòng Pick ít nhất 1 ghế trước khi đặt cọc =))');
      return;
    }
    
    // Check Authentication (Must be logged In)
    if(!localStorage.getItem('USER_LOGIN')) {
       message.error('Phát hiện bạn chưa có tài khoản, tự chuyển hướng nhé!');
       navigate('/dangnhap');
       return;
    }

    try {
      // payload requirement backend
      const payload = {
        maLichChieu: Number(maLichChieu),
        // Chuyển mảng nguyên cục Data Ghế -> Mảng đúng field yêu cầu API
        danhSachVe: gheDangChon.map(g => ({ maGhe: g.maGhe, giaVe: g.giaVe }))
      };
      // Quất payload lên
      await quanLyDatVeService.datVe(payload);
      
      // Popup đẹp AntD báo thành công
      notification.success({ 
        message: 'Hoàn tất giao dịch mua vé Rạp', 
        description: 'Vui lòng kiểm tra Profile mục "Lịch Sử Thanh Toán"!',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
      
      // Reset State
      setGheDangChon([]);
      // Reload Server State Load lại sơ đồ Update những ghế Vừa bị Mua
      fetchPhongVe(); 
    } catch (error) {
       message.error(error.response?.data?.content || 'Rớt Request (Kiểm tra lại Token Authorization)');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 100 }}><Spin size="large" tip="Robot đang dọn phòng..." /></div>;

  return (
    <div style={{ maxWidth: 1250, margin: '0 auto', padding: '50px 20px' }}>
      
      {/* Cần kiểm tra nếu API Sập mà Rạp trả về Null */}
      {!phongVe && <Alert message="Lỗi" description="Không thấy thông tin phòng" type="error" />}

      {phongVe && (
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          
          {/* CỘT TRÁI CHỨA CỤM MÀN HÌNH + SƠ ĐỒ LƯỚI */}
          <div style={{ flex: '1 1 700px' }}>
            {/* Thanh Mô phỏng Màn Hình Cinema Nhìn từ trên xuống */}
            <h3 style={{ textAlign: 'center', color: '#666', fontWeight: 600 }}>Tâm Màn Hình</h3>
            <div style={{ 
              background: '#444', 
              height: 12, 
              width: '80%', 
              margin: '10px auto 50px', 
              boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
              borderRadius: '2px' 
            }}></div>
            
            {/* Lưới Ghế CSS Grid Tuyệt Đỉnh 16 cột */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '10px' }}>
              {phongVe.danhSachGhe?.map(ghe => {
                const isPicking = gheDangChon.some(g => g.maGhe === ghe.maGhe);
                
                // Thuật toán gán dải màu dựa trên Status
                let bgColor = '#e0e0e0'; // Mặc định (Trống chơn)
                let cursor = 'pointer';
                let textColor = '#222';
                
                if (ghe.daDat) {
                  bgColor = '#f5222d'; // ĐỎ LÈM - Bị giật mất
                  cursor = 'not-allowed';
                  textColor = '#fff';
                } else if (isPicking) {
                  bgColor = '#52c41a'; // XANH - Ghế mình đang chỉa vào
                  textColor = '#fff';
                } else if (ghe.loaiGhe === 'Vip') {
                  bgColor = '#faad14'; // VÀNG CAM - Ghế sịn (Chưa ai lấy)
                }

                return (
                  <div 
                    key={ghe.maGhe}
                    onClick={() => chonGhe(ghe)}
                    title={ghe.loaiGhe === 'Vip' ? 'Ghế Vip - Giá cao' : 'Ghế Phổ thông'}
                    style={{ 
                      background: bgColor, 
                      height: 38, 
                      borderRadius: 6, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: cursor,
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: textColor,
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {isPicking ? 'X' : ghe.tenGhe}
                  </div>
                );
              })}
            </div>

            {/* Note Chú thích Màu Ngồi */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 50 }}>
               <div style={{display:'flex', alignItems: 'center'}}><div style={{width:25, height:25, background:'#e0e0e0', marginRight: 5, borderRadius:4}}></div> Mới tinh</div>
               <div style={{display:'flex', alignItems: 'center'}}><div style={{width:25, height:25, background:'#faad14', marginRight: 5, borderRadius:4}}></div> Hạng VIP</div>
               <div style={{display:'flex', alignItems: 'center'}}><div style={{width:25, height:25, background:'#52c41a', marginRight: 5, borderRadius:4}}></div> Đang nhắm</div>
               <div style={{display:'flex', alignItems: 'center'}}><div style={{width:25, height:25, background:'#f5222d', marginRight: 5, borderRadius:4}}></div> Ai đó đã lấy</div>
            </div>
          </div>

          {/* CỘT PHẢI CHỨA HÓA ĐƠN LẬP CHECKOUT PANEL */}
          <div style={{ flex: '1 1 350px', background: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 8px 25px rgba(0,0,0,0.06)', alignSelf: 'flex-start' }}>
            
            {/* Dùng Array Reduce cộng tiền thần thánh */}
            <h2 style={{ color: '#52c41a', textAlign: 'center', fontSize: 36, marginBottom: 20, fontWeight: 800 }}>
              {gheDangChon.reduce((sum, g) => sum + g.giaVe, 0).toLocaleString()} <span style={{fontSize: 20}}>đ</span>
            </h2>
            <hr style={{ border: '1px dashed #eee', margin: '20px 0' }} />
            
            <h3 style={{ fontSize: 22 }}>🎬 {phongVe.thongTinPhim?.tenPhim}</h3>
            <div style={{ margin: '15px 0', color: '#555', lineHeight: '1.8' }}>
              <p>📍 <strong>Địa điểm:</strong> {phongVe.thongTinPhim?.tenCumRap}</p>
              <p>🗺️ <strong>Chi nhánh:</strong> {phongVe.thongTinPhim?.diaChi}</p>
              <p>🕙 <strong>Khai màn:</strong> {phongVe.thongTinPhim?.ngayChieu} - Cứ đúng {phongVe.thongTinPhim?.gioChieu} là chiếu</p>
            </div>
            
            <hr style={{ border: '1px dashed #eee', margin: '20px 0' }} />
            
            <div style={{ fontSize: 16 }}>
              <span style={{ color: '#fa541c', fontWeight: 'bold' }}>
                Ghế chọn: 
              </span>
              {' '} 
              {gheDangChon.length > 0 
                ? gheDangChon.map(g => `[${g.tenGhe}]`).join(' ') 
                : <i style={{color: '#999'}}>Bạn chưa chọn ghế nào cả</i>}
            </div>
            
            <Button 
              size="large" 
              type="primary" 
              block 
              style={{ marginTop: 30, height: 55, fontSize: 18, fontWeight: 600, borderRadius: 8 }} 
              onClick={xuLyDatVe}
            >
              THANH TOÁN MUA
            </Button>
            
            <div style={{ marginTop: 15, fontSize: 12, color: '#aaa', textAlign: 'center' }}>
              <InfoCircleOutlined /> Vé đã đặt không thể đổi trả dưới mọi trường hợp
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default Booking;
