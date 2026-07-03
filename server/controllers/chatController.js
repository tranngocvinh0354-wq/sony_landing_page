const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cấu hình Model từ biến môi trường để linh hoạt cập nhật khi Google deprecate phiên bản cũ
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Khởi tạo System Instruction định hình vai trò của Chatbot
const SYSTEM_PROMPT = `Bạn là "Trợ lý Sony Alpha" — chuyên gia tư vấn máy ảnh Sony Alpha A6700.
Nhiệm vụ của bạn:
- Tư vấn về thông số kỹ thuật Sony A6700 (cảm biến APS-C 26MP, chống rung 5 trục, quay 4K 120fps, AF AI...)
- Gợi ý ống kính ngàm E phù hợp với nhu cầu người dùng
- Trả lời ngắn gọn, thân thiện, bằng tiếng Việt
- Nếu câu hỏi ngoài phạm vi sản phẩm Sony Alpha, hãy lịch sự chuyển hướng về chủ đề máy ảnh`;

// Khởi tạo model AI
const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  systemInstruction: SYSTEM_PROMPT,
});

// Thiết lập giới hạn tin nhắn và lịch sử hội thoại để tối ưu hiệu năng và chi phí
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 20;

const chatWithGemini = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Validate đầu vào từ người dùng
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Tin nhắn không được để trống' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `Tin nhắn quá dài (tối đa ${MAX_MESSAGE_LENGTH} ký tự)` });
    }

    // Giới hạn lịch sử hội thoại để kiểm soát context và chi phí
    const trimmedHistory = history.slice(-MAX_HISTORY_LENGTH);
    const geminiHistory = trimmedHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Bắt đầu phiên chat và gửi phản hồi
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);

    // Xử lý lỗi đặc thù khi model bị ngắt kết nối hoặc không tồn tại
    if (error.status === 404 || error.message?.includes('not found')) {
      return res.status(503).json({
        error: 'Model AI hiện không khả dụng, vui lòng liên hệ quản trị viên để cập nhật cấu hình.',
      });
    }

    res.status(500).json({ error: 'Lỗi kết nối AI, vui lòng thử lại.' });
  }
};

module.exports = { chatWithGemini };