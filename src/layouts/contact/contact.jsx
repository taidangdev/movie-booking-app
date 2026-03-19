import React, { useState } from "react";
import "./contact.css";

export default function Contact() {
  const [search, setSearch] = useState("");

  const data = [
    {
      title: "Snack đủ vị – chỉ 25K khi mua kèm combo",
      brand: "Galaxy Cinema",
      img: "https://images.unsplash.com/photo-1585647347483-22b66260dfff",
    },
    {
      title: "Student Tuesday - Giảm 40% vé 2D",
      brand: "Galaxy Cinema",
      img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    },
    {
      title: "KHÔNG CÒN CHÚNG TA - Giảm 40% vé 2D",
      brand: "Galaxy Cinema",
      img: "https://cdn.galaxycine.vn/media/2026/2/26/khong-con-chung-ta-500_1772078105031.jpg",
    },
    {
      title: "TÀI - Giảm 40% vé 2D",
      brand: "Galaxy Cinema",
      img: "https://cdn.galaxycine.vn/media/2026/2/27/tai_1772174772211.jpg",
    },
  ];

  // 🔥 FILTER THEO TÊN
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="promo-container">
      <h1 className="title">Tin khuyến mãi</h1>
      <p className="subtitle">
        Có {filteredData.length} ưu đãi đang diễn ra
      </p>

      <div className="filters">
        <input
          className="search"
          placeholder="Tìm theo tiêu đề..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="select">
          <option>Tất cả tag</option>
        </select>

        <select className="select">
          <option>Ưu tiên cao trước</option>
        </select>
      </div>

      <div className="card-wrapper">
        {filteredData.map((item, index) => (
          <div className="card" key={index}>
            <img src={item.img} alt="" />
            <h3>{item.title}</h3>
            <p>{item.brand}</p>
          </div>
        ))}
      </div>
    </div>
  );
}