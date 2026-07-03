import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';

const FloatingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useShop();

  // Tính tổng số lượng sản phẩm và tổng tiền (chuyển đổi chuỗi "32.990.000đ" thành số)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const priceNumber = parseInt(item.price.replace(/\D/g, ''));
    return sum + (priceNumber * item.quantity);
  }, 0);

  return (
    <>
      {/* --- NÚT GIỎ HÀNG LƠ LỬNG --- */}
      {/* bottom-24 giúp nút nằm ngay trên Chatbot (thường là bottom-6) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 p-4 bg-zinc-900 border border-zinc-700 text-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-zinc-800 hover:border-amber-500 transition-all flex items-center justify-center group"
        aria-label="Mở giỏ hàng"
      >
        <svg className="w-6 h-6 text-zinc-300 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>

        {/* Chấm đỏ hiển thị số lượng (Badge) */}
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-zinc-950">
            {totalItems}
          </span>
        )}
      </button>

      {/* --- SIDEBAR HIỂN THỊ CHI TIẾT GIỎ HÀNG --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Lớp mờ nền (Overlay) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Bảng trượt từ bên phải */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-50 p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
                <h3 className="text-xl font-bold text-white">Giỏ hàng của bạn</h3>
                <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center text-zinc-500 mt-20">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <p>Giỏ hàng đang trống.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                      <img src={item.src} alt={item.alt} className="w-16 h-16 object-contain rounded-md bg-zinc-800/30" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-zinc-100">{item.label}</h4>
                        <p className="text-amber-500 text-sm font-medium">{item.price}</p>
                      </div>
                      <div className="text-zinc-400 text-sm bg-zinc-800 px-3 py-1 rounded-full">
                        SL: {item.quantity}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Phần tổng kết và nút thanh toán */}
              {cart.length > 0 && (
                <div className="mt-6 pt-6 border-t border-zinc-800 bg-zinc-950">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-400">Tổng tạm tính:</span>
                    <span className="text-2xl font-bold text-amber-500">
                      {totalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <button className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20">
                    Tiến hành đặt hàng
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCart;