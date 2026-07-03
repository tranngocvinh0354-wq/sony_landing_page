const express = require('express');
const router = express.Router();
const { subscribeEmail, getAllSubscribers } = require('../controllers/subscribeController');

// Route POST /api/subscribe (Khách hàng đăng ký)
router.post('/subscribe', subscribeEmail);

// Route GET /api/subscribers (Admin xem danh sách)
router.get('/subscribers', getAllSubscribers);

module.exports = router;