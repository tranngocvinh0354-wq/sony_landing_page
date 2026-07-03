const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Định nghĩa Model Subscriber (Người đăng ký nhận báo giá)
const Subscriber = sequelize.define(
  'Subscriber',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // Đảm bảo tính duy nhất ở tầng DB để chống race condition
      unique: true, 
      validate: {
        isEmail: { msg: 'Địa chỉ email không hợp lệ' },
        notEmpty: { msg: 'Email không được để trống' },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        // Validation định dạng số điện thoại (nếu có dữ liệu)
        is: {
          args: /^[0-9+\-\s]{8,15}$/,
          msg: 'Số điện thoại không hợp lệ',
        },
      },
    },
  },
  {
    // Cấu hình timestamps và quy tắc đặt tên bảng đồng bộ
    timestamps: true,
    underscored: true, 
    tableName: 'subscribers',
  }
);

module.exports = Subscriber;