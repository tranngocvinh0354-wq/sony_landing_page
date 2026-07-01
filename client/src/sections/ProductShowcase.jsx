import { useState } from 'react';
import { motion } from 'framer-motion';

// --- Data tách riêng khỏi JSX: dễ thêm/sửa setup hoặc tính năng mà không đụng phần render ---

// Object lookup thay cho chuỗi ternary lồng nhau (selectedView === 'body' ? ... : ...)
// -> thêm 1 view mới chỉ cần thêm 1 dòng vào đây, không sửa logic hiển thị ảnh
const VIEWS = {
  body: { src: '/body.webp', label: 'Chỉ thân máy', alt: 'Sony A6700 chỉ thân máy' },
  kit: { src: '/kit.jpeg', label: 'Kit 18-135mm', alt: 'Sony A6700 kèm ống kính kit 18-135mm' },
  vlog: { src: '/vlog.jpg', label: 'Setup Vlogger', alt: 'Sony A6700 setup dành cho Vlogger' },
};
// Giữ thứ tự nút hiển thị tách biệt với dữ liệu ảnh, phòng khi cần đổi thứ tự nút mà không đổi data
const VIEW_ORDER = ['body', 'kit', 'vlog'];

const ERGONOMIC_FEATURES = [
  {
    id: 'viewfinder',
    title: 'Kính ngắm XGA OLED Tru-Finder',
    description:
      'Độ phân giải 2.36 triệu điểm ảnh, độ sáng tương đương A7R V giúp quan sát rõ nét ngay cả dưới trời nắng gắt.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </>
    ),
  },
  {
    id: 'screen',
    title: 'Màn hình LCD xoay lật đa góc',
    description:
      'Màn hình cảm ứng 3.0 inch hỗ trợ thao tác chạm trực quan, hoàn hảo cho việc tự quay Vlog hoặc chụp góc khó.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    ),
  },
  {
    id: 'dial',
    title: 'Vòng xoay chức năng thông minh',
    description:
      'Bổ sung bánh xe gán phía trước thân máy và công tắc chuyển nhanh chế độ Ảnh/Video/S&Q vô cùng tiện lợi.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    ),
  },
];

const ProductShowcase = () => {
  const [selectedView, setSelectedView] = useState('kit');
  const currentView = VIEWS[selectedView];

  return (
    <section
      id="product-showcase"
      className="py-32 px-6 bg-gradient-to-b from-zinc-950 to-luxuryBlack relative overflow-hidden border-t border-zinc-900"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Cột 1: Hình ảnh tương tác đổi thiết lập (View) */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="absolute w-[400px] h-[400px] bg-zinc-700/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="w-full max-w-[450px] aspect-[4/3] rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md p-8 flex items-center justify-center relative group shadow-2xl overflow-hidden">
            <motion.img
              key={selectedView}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={currentView.src}
              alt={currentView.alt} // alt mô tả đúng theo từng setup, tốt cho accessibility & SEO thay vì alt chung chung cố định
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(245,158,11,0.2)]"
            />
          </div>

          {/* Các nút chuyển đổi Setup */}
          <div
            role="tablist" // đây thực chất là tab-switch cho 1 nội dung, khai báo role giúp screen reader hiểu đúng
            aria-label="Chọn cấu hình sản phẩm"
            className="flex space-x-4 mt-8 bg-zinc-900/60 border border-zinc-800 px-4 py-2 rounded-full backdrop-blur-md z-10"
          >
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
        </div>

        {/* Cột 2: Bóc tách thiết kế */}
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