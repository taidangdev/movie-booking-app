import React, { useEffect, useState } from "react";
import { Carousel, Spin, Alert } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { fetchLayDanhSachPhim } from "../../../redux/slices/quanLyPhimSlice";
import MovieCard from "../../../components/MovieCard";

const bannerStyle = {
  height: "600px",
  color: "#fff",
  lineHeight: "600px",
  textAlign: "center",
  background: "#364d79",
  fontSize: "50px",
  fontWeight: "bold",
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "inset 0 0 0 2000px rgba(0,0,0,0.4)",
};

const Home = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const { mangPhim, isLoading, error } = useSelector(
    (state) => state.quanLyPhim,
  );

  useEffect(() => {
    dispatch(fetchLayDanhSachPhim("GP01"));
  }, [dispatch]);

  const renderBanners = () => {
    if (mangPhim && mangPhim.length > 0) {
      const topMovies = mangPhim.slice(0, 3);
      return topMovies.map((movie, index) => (
        <div key={`banner-${index}`}>
          <h3
            style={{
              ...bannerStyle,
              backgroundImage: `url(${movie.hinhAnh})`,
            }}
          >
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

  const filteredMovies = mangPhim?.filter((movie) =>
    movie.tenPhim.toLowerCase().startsWith(search.toLowerCase()),
  );

  return (
    <div>
      <Carousel autoplay effect="fade">
        {renderBanners()}
      </Carousel>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "30px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          LỊCH PHIM ĐANG CHIẾU TOÀN QUỐC
        </h2>

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <input
            type="text"
            placeholder=" Tìm phim theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "14px 18px",
              borderRadius: "12px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "16px",
            }}
          />
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <Spin size="large" />
            <div style={{ padding: 10, color: "#999", marginTop: 15 }}>
              Hệ thống rạp đang tải nhanh dữ liệu phim...
            </div>
          </div>
        )}

        {!isLoading && error && (
          <Alert
            message="Không thể kết nối với Cơ Sở Dữ Liệu"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

        {!isLoading && !error && (
          <>
            {filteredMovies?.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#666",
                  fontSize: "18px",
                }}
              >
                Không tìm thấy phim phù hợp
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "30px",
                }}
              >
                {filteredMovies?.map((movie) => (
                  <div key={movie.maPhim}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
