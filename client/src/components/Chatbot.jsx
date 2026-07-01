import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dữ liệu tin nhắn chào mừng mặc định
const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: 'Chào bạn! Bạn cần tư vấn thêm về máy ảnh A6700 hay các dòng ống kính E-mount đi kèm?',
};

// Nội dung tin nhắn trả lời tự động của Bot
const AUTO_REPLY_TEXT =
  'Cảm ơn bạn đã quan tâm! Hiện tại chuyên viên tư vấn đang bận. Bạn vui lòng để lại Email ở Form đăng ký bên dưới, chúng tôi sẽ gửi báo giá A6700M ngay nhé!';

const AUTO_REPLY_DELAY_MS = 1000;

// Hàm tạo ID ngẫu nhiên cho mỗi tin nhắn
const createMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const Chatbot = () => {
  // Khởi tạo các trạng thái (state) cho Chatbot
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Khởi tạo Ref để xử lý cuộn trang và bộ đếm thời gian
  const messagesEndRef = useRef(null);
  const timeoutRef = useRef(null); 

  // Hàm tự động cuộn màn hình xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  // Hàm dọn dẹp bộ đếm thời gian khi đóng cửa sổ chat
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Hàm xử lý sự kiện khi người dùng bấm nút Gửi
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    
    if (!trimmed || isBotTyping) return; 

    setMessages((prev) => [...prev, { id: createMessageId(), sender: 'user', text: trimmed }]);
    setInput('');
    setIsBotTyping(true);

    timeoutRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { id: createMessageId(), sender: 'bot', text: AUTO_REPLY_TEXT }]);
      setIsBotTyping(false);
    }, AUTO_REPLY_DELAY_MS);
  }, [input, isBotTyping]);

  // Hàm xử lý sự kiện khi người dùng nhấn phím Enter
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') handleSend();
    },
    [handleSend]
  );

  // Giao diện hiển thị của Chatbot
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {isChatOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-luxuryCard border border-zinc-800 w-[320px] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Phần Header của khung chat */}
            <div className="bg-amber-500 p-4 flex justify-between items-center text-black">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                <h3 className="font-bold text-sm tracking-wide">Trợ lý Sony Alpha</h3>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                aria-label="Đóng cửa sổ chat"
                className="text-black hover:text-zinc-800 font-bold text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {/* Phần hiển thị danh sách tin nhắn */}
            <div className="p-5 h-64 overflow-y-auto text-sm space-y-4 bg-zinc-900/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-black rounded-tr-sm'
                        : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-zinc-700/50'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Phần hiển thị hiệu ứng khi Bot đang gõ chữ */}
              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl rounded-tl-sm bg-zinc-800 border border-zinc-700/50 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Phần ô nhập liệu và nút gửi tin nhắn */}
            <div className="p-3 border-t border-zinc-800 flex items-center gap-2 bg-black">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi..."
                aria-label="Nhập câu hỏi cho trợ lý"
                className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-200 px-4 py-2 rounded-full focus:outline-none focus:border-amber-500 text-xs transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isBotTyping} 
                aria-label="Gửi tin nhắn"
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 disabled:cursor-not-allowed text-black p-2 rounded-full font-bold transition-transform enabled:hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Nút thu nhỏ mở cửa sổ chat ngoài màn hình chính */
          <motion.button
            key="chat-toggle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsChatOpen(true)}
            aria-label="Mở cửa sổ chat"
            className="bg-amber-500 hover:bg-amber-400 text-black p-4 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-110 flex items-center justify-center group"
          >
            <svg className="w-6 h-6 group-hover:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <svg className="w-6 h-6 hidden group-hover:block animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;