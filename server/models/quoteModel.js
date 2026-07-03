const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Danh sách trạng thái hợp lệ cho báo giá
const QUOTE_STATUSES = ['Pending', 'Sent'];

const ProductQuote = sequelize.define(
  'ProductQuote',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quote_status: {
      // Sử dụng ENUM để đảm bảo dữ liệu chỉ chấp nhận các giá trị đã định nghĩa
      type: DataTypes.ENUM(...QUOTE_STATUSES),
      defaultValue: 'Pending',
      allowNull: false,
    },
    estimated_price: {
      // Sử dụng DECIMAL thay vì FLOAT để đảm bảo độ chính xác tuyệt đối cho tiền tệ
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Giá dự kiến không được là số âm',
        },
      },
    },
  },
  {
    // Đồng bộ thời gian và quy tắc đặt tên bảng
    timestamps: true,
    underscored: true,
    tableName: 'product_quotes',
  }
);

module.exports = ProductQuote;
// Export danh sách trạng thái để tái sử dụng trong các Controller hoặc Frontend
module.exports.QUOTE_STATUSES = QUOTE_STATUSES;