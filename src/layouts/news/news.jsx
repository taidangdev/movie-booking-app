import React from "react";
import "./news.css";

const newsData = [
  {
    id: 1,
    title: "Tặng 01 lượt chụp ảnh lấy liền",
    date: "20/03/2026 - 22/03/2026",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Mua 02 vé Gold Class cùng mẹ xem phim",
    date: "20/03/2026 - 22/03/2026",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Thử thách đi thám nhận quà",
    date: "20/03/2026 - 22/03/2026",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Quà tặng độc quyền",
    date: "15/03/2026",
    image:
      "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Vali quà tặng độc quyền",
    date: "15/03/2026",
    image:
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Mở đa giác quan nhận ngay ưu đãi",
    date: "13/03 - 31/03/2026",
    image:
      "https://images.unsplash.com/photo-1460881680858-30d872d5b530?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "CGV Culture Day xem phim cả ngày",
    date: "Thứ 2 Cuối Cùng Mỗi Tháng",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Cùng bé ghé thăm phòng chiếu CineKids",
    date: "14/03/2026",
    image:
      "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function News() {
  return (
    <div className="news-page">
      <div className="news-container">
        <div className="news-header">
          <div className="line" />
          <h1>TIN MỚI VÀ ƯU ĐÃI</h1>
          <div className="line" />
        </div>

        <div className="news-tabs">
          <button className="tab active">Xem tất cả</button>
          <button className="tab">Chọn Rạp</button>
        </div>

        <div className="news-grid">
          {newsData.map((item) => (
            <div className="news-card" key={item.id}>
              <div className="news-image-wrap">
                <img src={item.image} alt={item.title} className="news-image" />
              </div>

              <div className="news-date">
                <span className="calendar-icon">🗓</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}