const { sequelize } = require('../config/db');
const Subscriber = require('./subscriberModel');
const Campaign = require('./campaignModel');
const Registration = require('./registrationModel');
const ProductQuote = require('./quoteModel');

// --- THIẾT LẬP MỐI QUAN HỆ (RELATIONSHIPS) ---

// 1. Mối quan hệ giữa Subscriber và Registration (1-N)
Subscriber.hasMany(Registration, { foreignKey: 'subscriber_id', as: 'registrations' });
Registration.belongsTo(Subscriber, { foreignKey: 'subscriber_id', as: 'subscriber' });

// 2. Mối quan hệ giữa Campaign và Registration (1-N)
// onDelete: 'RESTRICT' để ngăn xóa Campaign nếu còn dữ liệu đăng ký thực tế
Campaign.hasMany(Registration, { foreignKey: 'campaign_id', as: 'registrations', onDelete: 'RESTRICT' });
Registration.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

// 3. Mối quan hệ giữa Registration và ProductQuote (1-N)
// onDelete: 'CASCADE' để tự động xóa báo giá khi đơn đăng ký bị xóa
Registration.hasMany(ProductQuote, { foreignKey: 'registration_id', as: 'quotes', onDelete: 'CASCADE' });
ProductQuote.belongsTo(Registration, { foreignKey: 'registration_id', as: 'registration' });

// Khởi tạo dữ liệu chiến dịch Marketing mặc định
const DEFAULT_CAMPAIGNS = ['A6700M_Preorder_Launch', 'Facebook_Ads_Q3'];

const initDefaultData = async () => {
  try {
    const count = await Campaign.count();
    if (count === 0) {
      // Sử dụng bulkCreate để tối ưu hiệu suất tạo dữ liệu (INSERT số lượng lớn)
      await Campaign.bulkCreate(DEFAULT_CAMPAIGNS.map((campaign_name) => ({ campaign_name })));
      console.log('🌱 Đã tạo dữ liệu Marketing Campaigns mẫu.');
    }
  } catch (error) {
    console.error('Lỗi tạo dữ liệu mẫu:', error);
  }
};

module.exports = {
  sequelize,
  Subscriber,
  Campaign,
  Registration,
  ProductQuote,
  initDefaultData,
};