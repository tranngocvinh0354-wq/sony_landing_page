const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Định nghĩa Model Campaign (Chiến dịch)
const Campaign = sequelize.define(
  'Campaign',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    campaign_name: {
      type: DataTypes.STRING,
      allowNull: false,
      // Ràng buộc dữ liệu đầu vào tại tầng Model
      validate: {
        notEmpty: { msg: 'Tên chiến dịch không được để trống' },
        len: {
          args: [1, 255],
          msg: 'Tên chiến dịch phải từ 1 đến 255 ký tự',
        },
      },
    },
  },
  {
    // Tự động quản lý createdAt/updatedAt
    timestamps: true,
    // Chuyển đổi tên cột sang snake_case (VD: created_at)
    underscored: true,
    // Định nghĩa tên bảng tường minh trong Database
    tableName: 'campaigns', 
  }
);

module.exports = Campaign;