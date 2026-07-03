const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Cài đặt thời gian chờ tối đa cho request (15 giây)
const DEFAULT_TIMEOUT_MS = 15000; 

/**
 * Gửi tin nhắn chat lên backend và nhận phản hồi.
 * @param {string} message - Nội dung tin nhắn của người dùng.
 * @param {Array} history - Lịch sử hội thoại trước đó (mặc định rỗng).
 * @returns {Promise<{ reply: string }>}
 */
export const sendChatMessage = async (message, history = []) => {
  // Kiểm tra và chặn tin nhắn rỗng ngay từ Frontend
  if (!message?.trim()) {
    throw new Error('Tin nhắn không được để trống');
  }

  // Thiết lập bộ hủy request tự động để chống kẹt mạng (treo ứng dụng)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    // Gửi dữ liệu tin nhắn và lịch sử hội thoại lên API
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim(), history }),
      signal: controller.signal,
    });

    // Kiểm tra và xử lý các mã lỗi HTTP trả về từ server
    if (!response.ok) {
      let errorMessage = `Lỗi server (mã ${response.status})`;
      
      // Trích xuất thông báo lỗi chi tiết từ định dạng JSON nếu có
      try {
        const err = await response.json();
        errorMessage = err.error || errorMessage;
      } catch {
        // Giữ nguyên lỗi mặc định nếu phản hồi không phải là JSON
      }
      throw new Error(errorMessage);
    }

    // Trả về dữ liệu phản hồi thành công
    return await response.json(); 
  } catch (error) {
    // Xử lý thông báo khi request bị hủy do quá thời gian chờ
    if (error.name === 'AbortError') {
      throw new Error('Yêu cầu quá thời gian chờ, vui lòng thử lại.');
    }
    // Trả các lỗi khác (mất mạng, lỗi máy chủ) ra bên ngoài Component
    throw error; 
  } finally {
    // Dọn dẹp bộ đếm thời gian khi luồng xử lý kết thúc
    clearTimeout(timeoutId);
  }
};