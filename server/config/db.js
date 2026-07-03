const { Sequelize } = require('sequelize');
require('dotenv').config();

// Kiểm tra sự tồn tại của các biến môi trường cấu hình DB
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_HOST'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  throw new Error(`Thiếu biến môi trường bắt buộc: ${missingEnvVars.join(', ')}`);
}

// Khởi tạo Sequelize Instance với cấu hình tối ưu
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false, 

  // Cấu hình charset UTF-8 để hỗ trợ đầy đủ tiếng Việt và ký tự đặc biệt
  dialectOptions: {
    charset: 'utf8mb4',
  },
  
  // Thiết lập múi giờ Việt Nam (UTC+7)
  timezone: '+07:00',

  // Cấu hình Connection Pool để quản lý kết nối hiệu quả
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});


module.exports = { sequelize };