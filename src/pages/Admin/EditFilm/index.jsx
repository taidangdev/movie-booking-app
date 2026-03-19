import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Switch, message, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { quanLyPhimService } from '../../../services/quanLyPhimService';
import dayjs from 'dayjs';

const EditFilm = () => {
  const { idFilm } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [fileToUpload, setFileToUpload] = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilmDetail = async () => {
      try {
        const result = await quanLyPhimService.layThongTinPhim(idFilm);
        const data = result.content;
        
        form.setFieldsValue({
          tenPhim: data.tenPhim,
          trailer: data.trailer,
          moTa: data.moTa,
          ngayKhoiChieu: data.ngayKhoiChieu ? dayjs(data.ngayKhoiChieu) : null,
          dangChieu: data.dangChieu,
          sapChieu: data.sapChieu,
          hot: data.hot,
          danhGia: data.danhGia
        });
        
        setImgPreview(data.hinhAnh);
        setLoading(false);
      } catch (error) {
        message.error('Lỗi khi truy xuất server');
      }
    };
    fetchFilmDetail();
  }, [idFilm, form]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => setImgPreview(e.target.result);
    }
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('maPhim', idFilm);
    formData.append('tenPhim', values.tenPhim || '');
    formData.append('trailer', values.trailer || '');
    formData.append('moTa', values.moTa || '');
    formData.append('maNhom', 'GP01');
    formData.append('ngayKhoiChieu', values.ngayKhoiChieu ? values.ngayKhoiChieu.format('DD/MM/YYYY') : '');
    formData.append('dangChieu', values.dangChieu || false);
    formData.append('sapChieu', values.sapChieu || false);
    formData.append('hot', values.hot || false);
    formData.append('danhGia', values.danhGia || 0);

    if (fileToUpload) {
      formData.append('File', fileToUpload, fileToUpload.name);
    }

    try {
      await quanLyPhimService.capNhatPhimUpload(formData);
      message.success('Cập nhật dữ liệu phim thành công!');
      navigate('/admin/films');
    } catch (error) {
      message.error(error.response?.data?.content || 'Cập nhật thất bại');
    }
  };

  if (loading) return <Skeleton active paragraph={{ rows: 10 }} />;

  return (
    <div>
      <h2 style={{ paddingBottom: 20 }}>Sửa Phim: {idFilm}</h2>
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} onFinish={onFinish}>
        <Form.Item label="Tên phim" name="tenPhim" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Trailer URL" name="trailer"><Input /></Form.Item>
        <Form.Item label="Nội dung tóm tắt" name="moTa"><Input.TextArea rows={5} /></Form.Item>
        <Form.Item label="Khởi chiếu vào" name="ngayKhoiChieu"><DatePicker format="DD/MM/YYYY" /></Form.Item>
        <Form.Item label="Đang chiếu" name="dangChieu" valuePropName="checked"><Switch /></Form.Item>
        <Form.Item label="Sắp chiếu" name="sapChieu" valuePropName="checked"><Switch /></Form.Item>
        <Form.Item label="Nổi bật (Hot)" name="hot" valuePropName="checked"><Switch /></Form.Item>
        <Form.Item label="Số sao" name="danhGia"><InputNumber min={1} max={10} /></Form.Item>
        
        <Form.Item label="Poster File Ảnh">
          <Input type="file" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
          {imgPreview && <img src={imgPreview} alt="preview" style={{ width: 130, marginTop: 15, borderRadius: 8 }} />}
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type="primary" htmlType="submit" size="large">Xác Nhận Lưu Lại</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditFilm;
