const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_TIMEOUT_MS = 15000; // chat có thể mất thời gian chờ AI trả lời, để timeout dài hơn form thường

/**
 * Gửi tin nhắn chat lên backend và nhận phản hồi.
 * @param {string} message - Nội dung tin nhắn của người dùng.
 * @param {Array} history - Lịch sử hội thoại trước đó (mặc định rỗng).
 * @returns {Promise<{ reply: string }>}
 */
export const sendChatMessage = async (message, history = []) => {
  if (!message?.trim()) {
    // Chặn từ sớm thay vì để backend nhận request rỗng rồi mới báo lỗi
    throw new Error('Tin nhắn không được để trống');
  }

  // AbortController để tự huỷ request nếu server không phản hồi kịp,
  // tránh người dùng chờ vô thời hạn khi mạng/server có vấn đề
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim(), history }),
      signal: controller.signal,
    });

    if (!response.ok) {
      // response.json() có thể tự ném lỗi nếu body không phải JSON hợp lệ
      // (VD: lỗi 500/502 trả về trang HTML) -> bọc trong try/catch riêng để không che mất lỗi HTTP gốc
      let errorMessage = `Lỗi server (mã ${response.status})`;
      try {
        const err = await response.json();
        errorMessage = err.error || errorMessage;
      } catch {
        // body không phải JSON -> giữ nguyên errorMessage mặc định ở trên
      }
      throw new Error(errorMessage);
    }

    return await response.json(); // { reply: "..." }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Yêu cầu quá thời gian chờ, vui lòng thử lại.');
    }
    throw error; // các lỗi khác (mạng mất, lỗi từ throw ở trên) truyền nguyên ra ngoài
  } finally {
    clearTimeout(timeoutId);
  }
};