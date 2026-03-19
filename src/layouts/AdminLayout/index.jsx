import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Space, Avatar } from 'antd';
import { 
  UserOutlined, 
  VideoCameraOutlined, 
  PlusOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Xử lý chuyển trang khi click menu
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const menuItems = [
    {
      key: '/admin/quanlynguoidung/index',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
    },
    {
      key: 'sub-films',
      icon: <VideoCameraOutlined />,
      label: 'Quản lý phim',
      children: [
        { key: '/admin/films', label: 'Danh sách phim' },
        { key: '/admin/films/addnew', icon: <PlusOutlined />, label: 'Thêm mới' },
      ],
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<SettingOutlined />}>
        Cập nhật thông tin
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} danger>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={250}>
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          color: 'white', 
          fontWeight: 'bold', 
          borderRadius: '4px',
          fontSize: collapsed ? '12px' : '16px'
        }}>
          {collapsed ? 'CYber' : 'CyberLearn'}
        </div>
        <Menu 
          theme="dark" 
          defaultSelectedKeys={[location.pathname]} 
          mode="inline" 
          items={menuItems} 
          onClick={handleMenuClick}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          boxShadow: '0 1px 4px rgba(0,21,41,.08)' 
        }}>
          <Dropdown overlay={userMenu} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()} style={{ color: '#333', fontWeight: '500', cursor: 'pointer' }}>
              <Space>
                <Avatar icon={<UserOutlined />} src="https://i.pravatar.cc/150?img=11" />
                Chào, Khải
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Header>
        
        <Content style={{ margin: '16px' }}>
          <div style={{ 
            padding: 24, 
            minHeight: 360, 
            background: '#fff', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
