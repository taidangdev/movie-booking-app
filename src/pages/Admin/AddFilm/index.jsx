import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Switch, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { quanLyPhimService } from '../../../services/quanLyPhimService';

const AddFilm = () => {
  const navigate = useNavigate();
  // Khai báo state lưu riêng file do người dùng pick up
  const [fileToUpload, setFileToUpload] = useState(null);
  const [imgPreview, setImgPreview] = useState('');

  // Handle Event: Nhận diện khi người dùng chọn File (Upload Hình)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file); // Lưu vào state chờ submit
      // Dùng FileReader đọc file local làm preview hình ảnh
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => setImgPreview(e.target.result);
    }
  };

  // Handle Submit Form
  const onFinish = async (values) => {
    // FORM-DATA REQUIREMENT (Bắt buộc dùng gửi ảnh)
    const formData = new FormData();
    formData.append('tenPhim', values.tenPhim || '');
    formData.append('trailer', values.trailer || '');
    formData.append('moTa', values.moTa || '');
    formData.append('maNhom', 'GP01');
    formData.append('ngayKhoiChieu', values.ngayKhoiChieu ? values.ngayKhoiChieu.format('DD/MM/YYYY') : '');
    formData.append('dangChieu', values.dangChieu || false);
    formData.append('sapChieu', values.sapChieu || false);
    formData.append('hot', values.hot || false);
    formData.append('danhGia', values.danhGia || 0);

    // Chèn Object File thực sự cùng tên của nó vào form
    if (fileToUpload) {
      formData.append('File', fileToUpload, fileToUpload.name);
    } else {
      message.error('Vui lòng chọn hình ảnh bìa phim!');
      return;
    }

    try {
      await quanLyPhimService.themPhimUploadHinh(formData);
      message.success('Đã thêm phim mới thành công!');
      navigate('/admin/films');
    } catch (error) {
       message.error(error.response?.data?.content || 'Tiến trình thêm phim thất bại');
    }
  };

  return (
    <div>
      <h2 style={{ paddingBottom: 20 }}>Thêm Mới Phim Phân Hệ GP01</h2>
      <Form 
        labelCol={{ span: 4 }} 
        wrapperCol={{ span: 14 }} 
        layout="horizontal" 
        onFinish={onFinish}
        initialValues={{ dangChieu: true, sapChieu: false, hot: true, danhGia: 5 }}
      >
        <Form.Item label="Tên phim" name="tenPhim" rules={[{ required: true, message: 'Vui lòng nhập' }]}>
          <Input placeholder="Nhập tên phim..." />
        </Form.Item>
        <Form.Item label="Trailer" name="trailer"><Input placeholder="Nhập link Youtube" /></Form.Item>
        <Form.Item label="Mô tả" name="moTa"><Input.TextArea rows={4} placeholder="Nhập tóm tắt..." /></Form.Item>
        
        <Form.Item label="Ngày chiếu" name="ngayKhoiChieu" rules={[{ required: true }]}>
          <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày" />
        </Form.Item>
        
        <Form.Item label="Chế độ Đang chiếu" name="dangChieu" valuePropName="checked"><Switch /></Form.Item>
        <Form.Item label="Chế độ Sắp chiếu" name="sapChieu" valuePropName="checked"><Switch /></Form.Item>
        <Form.Item label="Phim HOT" name="hot" valuePropName="checked"><Switch /></Form.Item>
        <Form.Item label="Xếp hạng (1-10)" name="danhGia"><InputNumber min={1} max={10} /></Form.Item>
        
        {/* Upload Button */}
        <Form.Item label="Poster (Hình Ảng)">
          <Input type="file" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
          {imgPreview && (
            <div style={{ marginTop: 10 }}>
              <img src={imgPreview} alt="preview" style={{ width: 150, borderRadius: 5 }} />
            </div>
          )}
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type="primary" htmlType="submit" size="large">Xác nhận Thêm Phim</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddFilm;
