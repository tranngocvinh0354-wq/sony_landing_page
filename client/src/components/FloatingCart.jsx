import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';

const FloatingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Quản lý luồng hiển thị: 'cart' (giỏ hàng) -> 'checkout' (điền form) -> 'success' (thành công)
  const [step, setStep] = useState('cart'); 
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái loading khi gọi API
  
  const { cart, updateQuantity, removeFromCart, clearCart } = useShop();

  const safeCart = Array.isArray(cart) ? cart : [];
  const totalItems = safeCart.reduce((sum, item) => sum + (item?.quantity || 1), 0);
  const totalPrice = safeCart.reduce((sum, item) => {
    if (!item) return sum;
    const priceString = String(item.price || '0');
    const priceNumber = parseInt(priceString.replace(/\D/g, ''), 10) || 0;
    return sum + (priceNumber * (item.quantity || 1));
  }, 0);

  // Xử lý đóng giỏ hàng (reset lại luồng)
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setStep('cart'), 300);
  };

  // Giả lập gọi API gửi đơn hàng về Server
  // Xử lý gửi dữ liệu đặt hàng sang Backend
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Thu thập dữ liệu từ các ô nhập liệu trong Form
    const formData = new FormData(e.currentTarget);
    
    // Đóng gói biểu mẫu dữ liệu theo cấu hình Backend yêu cầu
    const orderPayload = {
      customer: {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
      },
      items: safeCart.map(item => ({
        id: item.id,
        label: item.label,
        quantity: item.quantity || 1,
        price: item.price
      })),
      totalPrice: totalPrice
    };

    try {
      // Gọi API Endpoint của Backend (Sử dụng biến môi trường hoặc cổng mặc định localhost:5000)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch('https://sonylandingpage-production.up.railway.app/api/orders', {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('Gửi đơn hàng thất bại, vui lòng thử lại!');
      }

      // Xử lý khi Backend phản hồi thành công
      clearCart(); // Xóa sạch giỏ hàng cục bộ
      setStep('success'); // Chuyển sang giao diện thông báo thành công
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
      alert(error.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại Backend!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 p-4 bg-zinc-900 border border-zinc-700 text-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-zinc-800 hover:border-amber-500 transition-all flex items-center justify-center group"
      >
        <svg className="w-6 h-6 text-zinc-300 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-zinc-950">
            {totalItems}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={handleClose} 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            />
            
            <motion.div 
              initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
              className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-50 p-6 shadow-2xl flex flex-col"
            >
              
              {/* Header dùng chung */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  {step === 'checkout' && (
                    <button onClick={() => setStep('cart')} className="text-zinc-400 hover:text-amber-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                  )}
                  <h3 className="text-xl font-bold text-white">
                    {step === 'cart' ? 'Giỏ hàng của bạn' : step === 'checkout' ? 'Thông tin giao hàng' : 'Hoàn tất'}
                  </h3>
                </div>
                <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* MÀN HÌNH 1: DANH SÁCH GIỎ HÀNG */}
              {step === 'cart' && (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {safeCart.length === 0 ? (
                      <div className="text-center text-zinc-500 mt-20">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        <p>Giỏ hàng đang trống.</p>
                      </div>
                    ) : (
                      safeCart.map((item) => {
                        if (!item) return null;
                        const priceString = String(item.price || '0');
                        const itemQuantity = item.quantity || 1;
                        const itemPriceNumber = parseInt(priceString.replace(/\D/g, ''), 10) || 0;
                        const formattedTotalItemPrice = (itemPriceNumber * itemQuantity).toLocaleString('vi-VN');

                        return (
                          <div key={item.id} className="flex gap-4 items-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 transition-all hover:border-zinc-700">
                            <img src={item.src} alt={item.alt} className="w-16 h-16 object-contain rounded-md bg-zinc-800/30" />
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-zinc-100">{item.label}</h4>
                              <p className="text-amber-500 text-sm font-medium">{formattedTotalItemPrice}đ</p>
                            </div>
                            <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg p-1 border border-zinc-700">
                              <button onClick={() => updateQuantity(item.id, -1)} disabled={itemQuantity <= 1} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed">-</button>
                              <span className="text-xs font-bold w-4 text-center">{itemQuantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors">+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all ml-1">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {safeCart.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-zinc-800 bg-zinc-950">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-zinc-400">Tổng thanh toán:</span>
                        <span className="text-2xl font-bold text-amber-500">{totalPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <button onClick={() => setStep('checkout')} className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20">
                        Tiến hành đặt hàng
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* MÀN HÌNH 2: FORM ĐIỀN THÔNG TIN */}
              {step === 'checkout' && (
                // ĐÚNG
                  <form onSubmit={handleCheckoutSubmit} className="flex flex-col flex-1 min-h-0">
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Họ và tên *</label>
                      <input name="name" required type="text" placeholder="Nhập họ tên của bạn" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Số điện thoại *</label>
                      <input name="phone" required type="tel" placeholder="Ví dụ: 0912345678" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-1">Địa chỉ giao hàng *</label>
                      <textarea name="address" required rows="3" placeholder="Ví dụ: Phường 15, Quận Tân Phú, TP.HCM" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"></textarea>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Số lượng sản phẩm:</span>
                        <span className="text-white font-bold">{totalItems}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Tổng phải thanh toán:</span>
                        <span className="text-amber-500 font-bold">{totalPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-zinc-800 bg-zinc-950">
                    <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:hover:scale-100">
                      {isSubmitting ? (
                        <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : 'Xác nhận đặt hàng'}
                    </button>
                  </div>
                </form>
              )}

              {/* MÀN HÌNH 3: ĐẶT HÀNG THÀNH CÔNG */}
              {step === 'success' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/50">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Đặt hàng thành công!</h2>
                  <p className="text-zinc-400 px-4">Cảm ơn bạn đã tin tưởng NgocZink. Chúng tôi sẽ liên hệ để xác nhận đơn hàng trong thời gian sớm nhất.</p>
                  <button onClick={handleClose} className="mt-8 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-full transition-colors">
                    Tiếp tục mua sắm
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