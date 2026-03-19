import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import CinemaLogo from '../../components/CinemaLogo';
import { Dropdown, Menu, Space, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, IdcardOutlined } from '@ant-design/icons';

const ClientLayout = () => {
  const navigate = useNavigate();

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const linkStyle = { 
    margin: '0 15px', 
    textDecoration: 'none', 
    color: '#333', 
    fontWeight: '500',
    fontSize: 16
  };
  
  const authBtnStyle = { 
    marginLeft: '15px', 
    padding: '8px 24px', 
    borderRadius: '6px', 
    textDecoration: 'none', 
    fontWeight: 'bold',
    transition: 'all 0.3s'
  };

  // CHECK XÁC THỰC
  const userStr = localStorage.getItem('USER_LOGIN');
  const userInfo = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('USER_LOGIN');
    navigate('/dangnhap');
    window.location.reload(); // Ép F5 để Navbar giật lại null
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<IdcardOutlined />} onClick={() => navigate('/thongtincanhan')}>
        Hồ sơ cá nhân / Vé
      </Menu.Item>
      {userInfo?.maLoaiNguoiDung === 'QuanTri' && (
        <Menu.Item key="0" icon={<UserOutlined />} onClick={() => navigate('/admin/films')}>
          Trang Quản Trị (Admin Panel)
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout} danger>
        Đăng xuất thoát
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Roboto', sans-serif" }}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: '40px' }}>
            <CinemaLogo width={45} height={45} />
            <span style={{ marginLeft: '12px', fontSize: '24px', color: '#fa541c', fontWeight: '900', letterSpacing: 1 }}>
              CYBER <span style={{color: '#333'}}>MOVIE</span>
            </span>
          </NavLink>
          <NavLink to="/" style={linkStyle}>Trang chủ Phim</NavLink>
          <NavLink to="/contact" style={linkStyle}>Cụm Rạp</NavLink>
          <NavLink to="/news" style={linkStyle}>Tin tức Review</NavLink>
          <NavLink to="/" style={linkStyle}>Ứng dụng App</NavLink>
        </div>
        
        {/* Toggle Login/Logout dựa trên LocalStorage */}
        <div>
          {userInfo ? (
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: '#f5f5f5', padding: '5px 15px', borderRadius: 20 }}>
                <Avatar style={{ backgroundColor: '#fa541c' }} icon={<UserOutlined />} />
                <span style={{ fontWeight: 600, color: '#333' }}>Chào, {userInfo.hoTen || userInfo.taiKhoan}</span>
              </div>
            </Dropdown>
          ) : (
            <>
              <NavLink to="/dangnhap" style={{ ...authBtnStyle, color: '#fa541c', border: '1.5px solid #fa541c' }}>
                Đăng nhập
              </NavLink>
              <NavLink to="/dangky" style={{ ...authBtnStyle, color: '#fff', backgroundColor: '#fa541c', padding: '9px 24px' }}>
                Gia nhập ngay
              </NavLink>
            </>
          )}
        </div>
      </header>

      {/* Content Auto Push Footer */}
      <main style={{ flex: 1, backgroundColor: '#f5f7fa', minHeight: '80vh' }}>
        <Outlet />
      </main>

      {/* Footer Tĩnh */}
      <footer style={{ backgroundColor: '#111', color: '#aaa', padding: '50px 0', marginTop: 'auto', borderTop: '4px solid #fa541c' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#fff', fontSize: 24, letterSpacing: 1 }}>CYBER MOVIE</h3>
            <p style={{marginTop: 15}}>Hệ thống đặt vé xem phim tích hợp công nghệ AI.</p>
            <p>© 2026 Bản quyền sở hữu của học viên Cybersoft.</p>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 15 }}>Hệ thống đối tác</h4>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
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
