const express = require('express');
const router = express.Router();

// Endpoint: POST /api/orders
router.post('/', async (req, res) => {
  try {
    // Trích xuất thông tin từ gói dữ liệu Client gửi lên
    const { customer, items, totalPrice } = req.body;

    // Kiểm tra tính hợp lệ
    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Dữ liệu đơn hàng không hợp lệ!' });
    }

    // LOGIC XỬ LÝ (Tạm thời in ra Console, sau này bạn có thể dùng Sequelize để insert vào bảng Orders)
    console.log('📦 === CÓ ĐƠN HÀNG MỚI TỪ LANDING PAGE === 📦');
    console.log('👤 Khách hàng:', customer);
    console.log('🛒 Sản phẩm:', items);
    console.log('💰 Tổng thanh toán:', totalPrice, 'VNĐ');
    console.log('==============================================');

    // Phản hồi về cho React để hiển thị thông báo thành công
    return res.status(201).json({
      success: true,
      message: 'Đơn hàng đã được ghi nhận trên hệ thống!',
    });
    
  } catch (error) {
    console.error('❌ Lỗi xử lý đơn hàng:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống máy chủ nội bộ!' });
  }
});

module.exports = router;