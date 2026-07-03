const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Định nghĩa Model Registration (Đơn đăng ký nhận báo giá)
const Registration = sequelize.define(
  'Registration',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    source_platform: {
      // Sử dụng STRING để hỗ trợ sự linh hoạt khi thêm mới các nguồn traffic Marketing
      type: DataTypes.STRING,
      defaultValue: 'Direct',
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nguồn đăng ký không được để trống' },
        len: {
          args: [1, 100],
          msg: 'Tên nguồn đăng ký tối đa 100 ký tự',
        },
      },
    },
  },
  {
    // Cấu hình timestamps và quy tắc đặt tên bảng đồng bộ
    timestamps: true,
    underscored: true,
    tableName: 'registrations',
  }
);

module.exports = Registration;