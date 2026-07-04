require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Gọi trạm trung chuyển (models/index.js) để lấy sequelize và hàm tạo dữ liệu mẫu
const { sequelize, initDefaultData } = require('./models');

// --- IMPORT CÁC ROUTES ---
const subscribeRoute = require('./routes/subscribeRoute');
const chatRoute = require('./routes/chatRoute');
const orderRoute = require('./routes/orderRoute'); // Khai báo route đơn hàng mới

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình CORS mở cửa cho mọi tên miền 
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- ĐĂNG KÝ CÁC API ENDPOINTS ---
app.use('/api', subscribeRoute);
app.use('/api/chat', chatRoute);
app.use('/api/orders', orderRoute); // Kích hoạt luồng nhận đơn hàng

// Thêm route cho trang chủ (Đã gom lên trên phần kết nối DB cho đúng chuẩn flow)
app.get('/', (req, res) => {
  res.send('<h1>✅ Server Backend Sony A6700M đang hoạt động xuất sắc!</h1><p>API đã sẵn sàng nhận dữ liệu tại /api/subscribe, /api/chat và /api/orders</p>');
});

// Kiểm tra kết nối và đồng bộ Database SQL
sequelize.authenticate()
  .then(() => {
    console.log('✅ Đã kết nối thành công với máy chủ SQL!');
    
    // Lệnh sync({ alter: true }) sẽ quét toàn bộ thư mục models 
    // và tự động tạo Bảng cùng các khóa ngoại mà không làm mất dữ liệu.
    return sequelize.sync({ alter: true }); 
  })
  .then(async () => {
    console.log('✅ Đã đồng bộ hóa toàn bộ sơ đồ Bảng CSDL!');
    
    // Kích hoạt hàm tạo chiến dịch Marketing mẫu
    await initDefaultData(); 

    app.listen(PORT, () => {
      console.log(`🚀 Server MVC đang chạy tại cổng ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối SQL:', err);
  });

