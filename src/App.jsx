import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Layouts
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';

// Lazy load pages - Client
const Home = React.lazy(() => import('./pages/Client/Home'));
const Register = React.lazy(() => import('./pages/Client/Register'));
const Login = React.lazy(() => import('./pages/Client/Login'));
const MovieDetail = React.lazy(() => import('./pages/Client/MovieDetail'));
const Booking = React.lazy(() => import('./pages/Client/Booking'));
const Profile = React.lazy(() => import('./pages/Client/Profile'));

// Lazy load pages - Admin
const Films = React.lazy(() => import('./pages/Admin/Films'));
const AddFilm = React.lazy(() => import('./pages/Admin/AddFilm'));
const EditFilm = React.lazy(() => import('./pages/Admin/EditFilm'));
const ShowTime = React.lazy(() => import('./pages/Admin/ShowTime'));
const Users = React.lazy(() => import('./pages/Admin/Users'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="trangchu" element={<Home />} />
            <Route path="dangky" element={<Register />} />
            <Route path="register" element={<Register />} />
            <Route path="dangnhap" element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="chitietphim/:maPhim" element={<MovieDetail />} />
            <Route path="detail/:id" element={<MovieDetail />} />
            <Route path="chitietphongve/:maLichChieu" element={<Booking />} />
            <Route path="ticketroom/:id" element={<Booking />} />
            <Route path="thongtincanhan" element={<Profile />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="films" element={<Films />} />
            <Route path="films/addnew" element={<AddFilm />} />
            <Route path="films/edit/:idFilm" element={<EditFilm />} />
            <Route path="films/showtime/:idFilm" element={<ShowTime />} />
            <Route path="quanlynguoidung/index" element={<Users />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
