import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

// Cấu hình đường dẫn API từ biến môi trường
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

const Subscribe = () => {
  // Khởi tạo các trạng thái (state) quản lý dữ liệu và form
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Hàm xử lý gửi dữ liệu đăng ký lên server
  const handleSubscribe = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/subscribe`,
        { email: trimmedEmail, phone: trimmedPhone },
        // Cài đặt thời gian chờ tối đa cho request (10 giây)
        { timeout: 10000 } 
      );

      if (response.data.success) {
        setIsSuccess(true);
        setMessage('Đăng ký thành công! Chuyên viên sẽ sớm liên hệ với bạn.');
        setEmail('');
        setPhone('');
      }
    } catch (error) {
      setIsSuccess(false);
      // Xử lý thông báo lỗi trả về từ server hoặc do rớt mạng
      const errorMessage = error.response?.data?.message
        ? error.response.data.message
        : 'Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng và thử lại.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="subscribe-section" className="py-20 bg-black text-white flex justify-center items-center">
      <div className="max-w-2xl w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 text-center drop-shadow-2xl"
        >
          {/* Tiêu đề của Form đăng ký */}
          <h2 className="text-3xl font-bold mb-4">Nhận Báo Giá Sony A6700M</h2>
          <p className="text-zinc-400 mb-8 text-sm">
            Trở thành những người đầu tiên sở hữu siêu phẩm. Để lại thông tin để nhận tư vấn VIP.
          </p>

          {/* Form nhập liệu thông tin khách hàng */}
          <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập địa chỉ Email của bạn *"
              required
              // Khóa ô nhập liệu khi đang gọi API
              disabled={loading} 
              autoComplete="email"
              className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-full focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-60"
            />

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại (Nhận diện khách hàng ưu tiên)"
              // Ràng buộc điều kiện (validate) định dạng số điện thoại hợp lệ
              pattern="[0-9+\s]{8,15}" 
              title="Vui lòng nhập số điện thoại hợp lệ"
              disabled={loading}
              autoComplete="tel"
              className="w-full bg-black border border-zinc-700 text-white px-6 py-4 rounded-full focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-60"
            />

            {/* Nút bấm gửi Form */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg px-6 py-4 rounded-full transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 mt-2"
            >
              {loading ? 'Đang xử lý...' : 'Đăng Ký Ngay'}
            </button>
          </form>

          {/* Khu vực hiển thị thông báo thành công hoặc lỗi */}
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // Thiết lập Aria để trình đọc màn hình tự động đọc thông báo
              role="status" 
              aria-live="polite"
              className={`mt-6 text-sm font-medium ${isSuccess ? 'text-green-500' : 'text-red-500'}`}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Subscribe;