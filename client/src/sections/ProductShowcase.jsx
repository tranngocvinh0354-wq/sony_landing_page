import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';

// Dữ liệu cấu hình hiển thị các phiên bản sản phẩm (Bổ sung id và price cho tính năng Giỏ hàng)
const VIEWS = {
  body: { id: 'a6700-body', src: '/body.webp', label: 'Chỉ thân máy', alt: 'Sony A6700 chỉ thân máy', price: '32.990.000đ' },
  kit: { id: 'a6700-kit', src: '/kit.jpeg', label: 'Kit 18-135mm', alt: 'Sony A6700 kèm ống kính kit 18-135mm', price: '42.990.000đ' },
  vlog: { id: 'a6700-vlog', src: '/vlog.jpg', label: 'Setup Vlogger', alt: 'Sony A6700 setup dành cho Vlogger', price: '45.490.000đ' },
};

// Danh sách thứ tự hiển thị các nút chọn phiên bản
const VIEW_ORDER = ['body', 'kit', 'vlog'];

// Dữ liệu danh sách các tính năng thiết kế nổi bật
const ERGONOMIC_FEATURES = [
  {
    id: 'viewfinder',
    title: 'Kính ngắm XGA OLED Tru-Finder',
    description: 'Độ phân giải 2.36 triệu điểm ảnh, độ sáng tương đương A7R V giúp quan sát rõ nét ngay cả dưới trời nắng gắt.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    ),
  },
  {
    id: 'screen',
    title: 'Màn hình LCD xoay lật đa góc',
    description: 'Màn hình cảm ứng 3.0 inch hỗ trợ thao tác chạm trực quan, hoàn hảo cho việc tự quay Vlog hoặc chụp góc khó.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    ),
  },
  {
    id: 'dial',
    title: 'Vòng xoay chức năng thông minh',
    description: 'Bổ sung bánh xe gán phía trước thân máy và công tắc chuyển nhanh chế độ Ảnh/Video/S&Q vô cùng tiện lợi.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    ),
  },
];

const ProductShowcase = () => {
  // Khởi tạo trạng thái phiên bản đang được chọn (mặc định là 'kit')
  const [selectedView, setSelectedView] = useState('kit');
  const currentView = VIEWS[selectedView];
  
  // Lấy các hàm xử lý Thương mại điện tử từ Context
  const { addToCart, toggleFavorite, favorites, addViewedProduct } = useShop();

  // Kiểm tra xem cấu hình hiện tại đã được yêu thích chưa
  const isFavorite = favorites.some((item) => item.id === currentView.id);

  // Ghi nhận lịch sử xem mỗi khi người dùng đổi cấu hình (chuyển tab)
  useEffect(() => {
    addViewedProduct(currentView);
  }, [selectedView, currentView, addViewedProduct]);

  return (
    <section id="product-showcase" className="py-32 px-6 bg-gradient-to-b from-zinc-950 to-luxuryBlack relative overflow-hidden border-t border-zinc-900">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* --- CỘT 1: HÌNH ẢNH & TÍNH NĂNG E-COMMERCE --- */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="absolute w-[400px] h-[400px] bg-zinc-700/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="w-full max-w-[450px] aspect-[4/3] rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md p-8 flex items-center justify-center relative group shadow-2xl overflow-hidden">
            
            {/* Nút thả tim (Yêu thích) góc trên bên phải ảnh */}
            <button
              onClick={() => toggleFavorite(currentView)}
              className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md border border-zinc-700/50 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            >
              <svg className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-zinc-400 fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Hình ảnh sản phẩm có Animation */}
            <motion.img
              key={selectedView}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={currentView.src}
              alt={currentView.alt}
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(245,158,11,0.2)]"
            />
          </div>

          {/* Khu vực nút bấm chuyển đổi phiên bản sản phẩm */}
          <div role="tablist" aria-label="Chọn cấu hình sản phẩm" className="flex space-x-4 mt-8 bg-zinc-900/60 border border-zinc-800 px-4 py-2 rounded-full backdrop-blur-md z-10">
            {VIEW_ORDER.map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={selectedView === key}
                onClick={() => setSelectedView(key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedView === key ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {VIEWS[key].label}
              </button>
            ))}
          </div>

          {/* Khối hiển thị Giá & Nút thêm vào giỏ hàng */}
          <div className="mt-8 flex items-center gap-6 z-10">
            <div className="flex flex-col">
              <span className="text-sm text-zinc-400">Giá dự kiến:</span>
              <span className="text-2xl font-bold text-amber-500">{currentView.price}</span>
            </div>
            <button
              onClick={() => addToCart(currentView)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-full transition-transform hover:scale-105 shadow-lg shadow-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>

        {/* --- CỘT 2: BÓC TÁCH THIẾT KẾ CÔNG THÁI HỌC --- */}
        <div className="space-y-10">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-bold block">
              Thiết kế Công Thái Học
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Tối Ưu Cho Từng Điểm Chạm</h2>
            <p className="text-zinc-400 font-light leading-relaxed">
              Thân máy được chế tác từ hợp kim Magie siêu bền, trọng lượng nhẹ kết hợp cùng báng cầm lớn hơn, mang lại
              cảm giác chắc chắn tuyệt đối khi sử dụng cùng các ống kính tele lớn.
            </p>
          </div>

          <div className="space-y-6">
            {ERGONOMIC_FEATURES.map(({ id, title, description, icon }) => (
              <motion.div
                key={id}
                whileHover={{ x: 10 }}
                className="flex items-start space-x-4 p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 transition-all"
              >
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-zinc-100">{title}</h4>
                  <p className="text-zinc-400 text-sm font-light mt-1">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductShowcase;