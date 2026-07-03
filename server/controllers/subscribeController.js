const { Subscriber } = require('../models');

// Định dạng kiểm tra Email cơ bản
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. Hàm thêm mới subscriber (Xử lý đăng ký nhận báo giá)
const subscribeEmail = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập địa chỉ email.' });
    }

    // Chuẩn hoá email (lowercase) để tránh trùng lặp do phân biệt hoa/thường
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Địa chỉ email không hợp lệ.' });
    }

    // Kiểm tra trùng lặp email trước khi tạo bản ghi mới
    const isExist = await Subscriber.findOne({ where: { email: normalizedEmail } });
    if (isExist) {
      return res.status(409).json({ success: false, message: 'Email này đã đăng ký nhận báo giá!' });
    }

    // Tạo bản ghi mới vào cơ sở dữ liệu
    const newSubscriber = await Subscriber.create({
      email: normalizedEmail,
      phone: phone?.trim() || null,
    });

    return res.status(201).json({ success: true, message: 'Hệ thống đã ghi nhận. Báo giá sẽ được gửi đến bạn!' });
  } catch (error) {
    // Xử lý lỗi trùng lặp khóa duy nhất (Email tồn tại) từ tầng Database
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'Email này đã đăng ký nhận báo giá!' });
    }

    console.error('Lỗi Controller:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ cơ sở dữ liệu.' });
  }
};

// 2. Hàm lấy danh sách subscriber (Dùng cho Admin — Lưu ý: Cần Middleware bảo mật)
const getAllSubscribers = async (req, res) => {
  try {
    // Xử lý phân trang để tối ưu hiệu năng khi dữ liệu tăng lớn
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 50, 200); 
    const offset = (page - 1) * pageSize;

    const { rows, count } = await Subscriber.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset,
    });

    return res.status(200).json({
      success: true,
      data: rows,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

module.exports = {
  subscribeEmail,
  getAllSubscribers,
};