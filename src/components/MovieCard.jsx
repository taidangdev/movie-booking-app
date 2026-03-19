import React from 'react';
import { Card, Button } from 'antd';
import { NavLink } from 'react-router-dom';

const { Meta } = Card;

const MovieCard = ({ movie }) => {
  return (
    <Card
      hoverable
      style={{ 
        width: '100%', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
      }}
      cover={
        <img 
          alt={movie?.tenPhim || 'Movie poster'} 
          src={movie?.hinhAnh || 'https://via.placeholder.com/300x400'} 
          style={{ height: 350, objectFit: 'cover' }} 
        />
      }
      actions={[
        <NavLink to={`/chitietphim/${movie?.maPhim || 1}`}>
          <Button type="primary" size="large" style={{ width: '90%', borderRadius: '4px' }}>
            Đặt vé
          </Button>
        </NavLink>
      ]}
    >
      <Meta 
        title={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>{movie?.tenPhim || 'Tên phim'}</span>} 
        description={movie?.moTa?.length > 50 ? movie.moTa.substring(0, 50) + '...' : movie?.moTa || 'Mô tả phim...'} 
      />
    </Card>
  );
};

export default MovieCard;
