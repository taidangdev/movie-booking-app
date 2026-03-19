import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import CinemaLogo from '../../components/CinemaLogo';
import { Dropdown, Menu, Avatar, Drawer, Button } from 'antd';
import { UserOutlined, LogoutOutlined, IdcardOutlined, MenuOutlined } from '@ant-design/icons';

const ClientLayout = () => {
  const navigate = useNavigate();
  // State điều khiển mở Hamburger Menu trên mobile
  const [openDrawer, setOpenDrawer] = useState(false);

  const linkStyle = { margin: '0 15px', textDecoration: 'none', color: '#333', fontWeight: '500', fontSize: 16 };
  const authBtnStyle = { marginLeft: '15px', padding: '8px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', transition: 'all 0.3s' };

  const userStr = localStorage.getItem('USER_LOGIN');
  const userInfo = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('USER_LOGIN');
    navigate('/dangnhap');
    setOpenDrawer(false); // Tắt mobile menu nếu đang mở
    window.location.reload();
  };

  // Menu thả xuống cho màn hình Máy TÍnh (PC)
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<IdcardOutlined />} onClick={() => navigate('/thongtincanhan')}>Hồ sơ cá nhân / Vé</Menu.Item>
      {userInfo?.maLoaiNguoiDung === 'QuanTri' && (
        <Menu.Item key="0" icon={<UserOutlined />} onClick={() => navigate('/admin/films')}>Trang Quản Trị</Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout} danger>Đăng xuất thoát</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Roboto', sans-serif" }}>
      
      {/* 1. THANH HEADER (CÓ SỬ DỤNG CÁC CLASS RESPONSIVE TRONG INDEX.CSS) */}
      <header 
        className="header-mobile" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo Phim hiển thị mọi màn hình */}
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: '30px' }}>
            <CinemaLogo width={45} height={45} />
            <span style={{ marginLeft: '10px', fontSize: '22px', color: '#fa541c', fontWeight: '900', letterSpacing: 1 }}>
              CYBER <span style={{color: '#333'}}>MOVIE</span>
            </span>
          </NavLink>
          
          {/* --- NHÓM MENU ĐỨNG: ẨN TRÊN ĐIỆN THOẠI (.md-hidden) --- */}
          <div className="md-hidden" style={{ display: 'flex', alignItems: 'center' }}>
            <NavLink to="/" style={linkStyle}>Trang chủ Phim</NavLink>
            <NavLink to="/lienhe" style={linkStyle}>Cụm Rạp</NavLink>
            <NavLink to="/tintuc" style={linkStyle}>Tin tức</NavLink>
          </div>
        </div>
        
        {/* --- NHÓM NÚT TÀI KHOẢN: ẨN TRÊN ĐIỆN THOẠI (.md-hidden) --- */}
        <div className="md-hidden">
          {userInfo ? (
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: '#f5f5f5', padding: '5px 15px', borderRadius: 20 }}>
                <Avatar style={{ backgroundColor: '#fa541c' }} icon={<UserOutlined />} />
                <span style={{ fontWeight: 600, color: '#333' }}>Chào, {userInfo.hoTen || userInfo.taiKhoan}</span>
              </div>
            </Dropdown>
          ) : (
            <div style={{display: 'flex'}}>
              <NavLink to="/dangnhap" style={{ ...authBtnStyle, color: '#fa541c', border: '1.5px solid #fa541c' }}>Đăng nhập</NavLink>
              <NavLink to="/dangky" style={{ ...authBtnStyle, color: '#fff', backgroundColor: '#fa541c', padding: '9px 24px' }}>Gia nhập</NavLink>
            </div>
          )}
        </div>

        {/* --- NÚT BẤM (HAMBURGER ICON): CHỈ HIỆN TRÊN ĐIỆN THOẠI (.mobile-show) --- */}
        <Button 
           className="mobile-show" 
           type="text" 
           icon={<MenuOutlined style={{ fontSize: 26, color: '#fa541c' }} />} 
           onClick={() => setOpenDrawer(true)} 
           style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}
        />
      </header>

      {/* 2. MENU RÚT KÉO CHO MOBILE (DRAWER ANT DESIGN) */}
      <Drawer 
        title={<span style={{color: '#fa541c', fontWeight: 900}}>CYBER MENU</span>} 
        placement="right" 
        onClose={() => setOpenDrawer(false)} 
        open={openDrawer}
        width={280}
      >
         <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {userInfo ? (
               <div style={{ background: '#fff5f2', padding: '20px', borderRadius: 12, textAlign: 'center', border: '1px solid #ffddd1' }}>
                 <Avatar style={{ backgroundColor: '#fa541c', marginBottom: 10 }} size={60} icon={<UserOutlined />} />
                 <h3 style={{ margin: 0, color: '#fa541c' }}>{userInfo.hoTen || userInfo.taiKhoan}</h3>
                 <p style={{ margin: 0, color: '#999', fontSize: 12 }}>{userInfo.maLoaiNguoiDung}</p>
               </div>
            ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                 <Button type="primary" danger size="large" onClick={() => { navigate('/dangky'); setOpenDrawer(false) }} block>Đăng ký ngay</Button>
                 <Button size="large" block onClick={() => { navigate('/dangnhap'); setOpenDrawer(false) }}>Hội viên Đăng nhập</Button>
               </div>
            )}

            <Menu mode="vertical" style={{ borderRight: 'none', fontSize: 16 }}>
               <Menu.Item key="home" onClick={() => { navigate('/'); setOpenDrawer(false) }}>Trang chủ Hệ Thống</Menu.Item>
               <Menu.Item key="rap">Mạng lưới Cụm rạp</Menu.Item>
               <Menu.Item key="tintuc">Sự kiện - Tin tức</Menu.Item>
               
               {userInfo && (
                  <>
                     <Menu.Divider />
                     <Menu.Item key="profile" icon={<IdcardOutlined style={{color: '#1890ff'}} />} onClick={() => { navigate('/thongtincanhan'); setOpenDrawer(false) }}>Hồ sơ & Lịch sử mua</Menu.Item>
                     {userInfo.maLoaiNguoiDung === 'QuanTri' && (
                        <Menu.Item key="admin" onClick={() => { navigate('/admin/films'); setOpenDrawer(false) }}>💼 Truy cập Trang Quản Trị</Menu.Item>
                     )}
                     <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout} danger>Đăng xuất an toàn</Menu.Item>
                  </>
               )}
            </Menu>
         </div>
      </Drawer>

      {/* 3. KHUNG HIỂN THỊ TRANG CON */}
      <main style={{ flex: 1, backgroundColor: '#f5f7fa', minHeight: '80vh' }}>
        <Outlet />
      </main>

      {/* 4. FOOTER RESPONSIVE (.footer-flex) */}
      <footer style={{ backgroundColor: '#111', color: '#aaa', padding: '50px 0', marginTop: 'auto', borderTop: '4px solid #fa541c' }}>
        <div className="footer-flex" style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#fff', fontSize: 24, letterSpacing: 1 }}>CYBER MOVIE</h3>
            <p style={{marginTop: 15}}>Hệ thống đặt vé xem phim tích hợp công nghệ AI.</p>
            <p>© 2026 Bản quyền sở hữu của học viên Cybersoft.</p>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 15 }}>Hệ thống đối tác</h4>
            {/* Canh lề giữa trên mobile, lề phải trên Desktop nhờ class footer-partners */}
            <div className="footer-partners" style={{ display: 'flex', gap: '15px' }}>
              <CinemaLogo width={45} height={45} />
              <div style={{ width: 45, height: 45, backgroundColor: '#fff', borderRadius: '50%' }}></div>
              <div style={{ width: 45, height: 45, backgroundColor: '#fff', borderRadius: '50%' }}></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
