import React, { useEffect } from 'react';
import { Carousel, Spin, Alert } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLayDanhSachPhim } from '../../../redux/slices/quanLyPhimSlice';
import MovieCard from '../../../components/MovieCard';

const bannerStyle = {
  height: '600px',
  color: '#fff',
  lineHeight: '600px',
  textAlign: 'center',
  background: '#364d79',
  fontSize: '50px',
  fontWeight: 'bold',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: 'inset 0 0 0 2000px rgba(0,0,0,0.4)', // Đổ bóng mờ chữ giúp dễ đọc
};

const Home = () => {
  const dispatch = useDispatch();

  // Bóc tách biến 'mangPhim' và các biến check trạng thái mạng (Loading/Error) từ Redux Store
  const { mangPhim, isLoading, error } = useSelector((state) => state.quanLyPhim);

  // Vòng đời Component: Ngay lúc component nhảy lên (Mount), sẽ Dispatch Thunk API thực hiện tác vụ chạy ngầm
  useEffect(() => {
    // Vừa bật app là gọi API mã GP01 luôn
    dispatch(fetchLayDanhSachPhim('GP01'));
  }, [dispatch]);

  // Hàm sinh UI cho Banner Carousel tự động tái sử dụng những phim hot (Vì chưa có API Banner riêng nên tạm dùng cách lấy 3 phim đầu lưới)
  const renderBanners = () => {
    if (mangPhim && mangPhim.length > 0) {
      const topMovies = mangPhim.slice(0, 3);
      return topMovies.map((movie, index) => (
        <div key={`banner-${index}`}>
          <h3 style={{ ...bannerStyle, backgroundImage: `url(${movie.hinhAnh})` }}>
            {movie.tenPhim.toUpperCase()}
          </h3>
        </div>
      ));
    }
    return (
      <div>
        <h3 style={bannerStyle}>ĐANG TẢI PHIM CỦA HỆ THỐNG RẠP...</h3>
      </div>
    );
  };

  return (
    <div>
      {/* 1. Component Banner Carousel tự động chuyển tab */}
      <Carousel autoplay effect="fade">
        {renderBanners()}
      </Carousel>

      {/* 2. Container hiển thị Danh sách Phim đổ lên Lưới Lặp Lại Dữ Liệu Redux */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '32px', 
          marginBottom: '40px', 
          fontWeight: 'bold', 
          color: '#333' 
        }}>
          LỊCH PHIM ĐANG CHIẾU TOÀN QUỐC
        </h2>

        {/* --- CƠ CHẾ IF/ELSE UI DÀNH CHO LOAD API --- */}
        
        {/* Truờng hợp mạng bị chậm / Đang render */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large">
               <div style={{ padding: 10, color: '#999', marginTop: 15 }}>Hệ thống rạp đang tải nhanh dữ liệu phim...</div>
            </Spin>
          </div>
        )}

        {/* Truờng hợp mất mạng / Báo lỗi 404,500 từ server */}
        {!isLoading && error && (
          <Alert
            message="Không thể kết nối với Cơ Sở Dữ Liệu"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

        {/* Trờng hợp bình thường ổn thoả */}
        {!isLoading && !error && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: '30px' 
          }}>
            {/* Lặp Map (Data -> UI) */}
            {mangPhim?.map((movie) => (
              <div key={movie.maPhim || Math.random()}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
