import { useCallback } from 'react';

// Hàm cuộn trang trượt mượt mà đến các khu vực (section) được chỉ định
const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

// Giao diện khu vực màn hình chính (Hero Section) ngay khi người dùng vừa vào web
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 px-6 overflow-hidden">
      {/* Hiệu ứng ánh sáng mờ (blur) làm nền trang trí */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center z-10">
        {/* Khu vực hiển thị tiêu đề và lời dẫn giới thiệu sản phẩm */}
        <div className="space-y-8 text-center lg:text-left">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-bold block animate-pulse">
            Máy ảnh APS-C Cao Cấp Nhất
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 to-zinc-400">
            Sáng tạo không giới hạn. <br />
            <span className="italic font-light text-zinc-300">Kỷ nguyên AI nhiếp ảnh.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            Sony Alpha 6700 kết hợp bộ xử lý AI chuyên dụng, cảm biến Exmor R™ 26.0 MP cùng ống kính 18-135mm linh hoạt, mang đến chất lượng hình ảnh điện ảnh cho mọi nhà sáng tạo nội dung.
          </p>
          
          {/* Nhóm nút bấm điều hướng (Call-to-Action) */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => scrollToSection('subscribe-section')}
              className="bg-zinc-100 hover:bg-amber-500 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-white/5 text-center text-sm tracking-wide cursor-pointer"
            >
              Nhận Báo Giá Đợt 1
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="bg-transparent border border-zinc-800 hover:border-zinc-600 text-zinc-300 py-4 px-8 rounded-full transition-all text-center text-sm tracking-wide cursor-pointer"
            >
              Xem Thêm Tính Năng
            </button>
          </div>
        </div>

        {/* Khu vực hiển thị hình ảnh sản phẩm chính */}
        <div className="relative justify-self-center lg:justify-self-end w-full max-w-[480px] aspect-square rounded-3xl bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 border border-zinc-800/80 p-8 flex items-center justify-center shadow-2xl backdrop-blur-sm group hover:border-zinc-700/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
          
          {/* Cấu hình tải ảnh ưu tiên (Eager Load) để tối ưu điểm hiệu năng LCP */}
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"
            alt="Sony Alpha 6700"
            width={1000}
            height={1000}
            loading="eager"
            fetchPriority="high"
            className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-[float_6s_ease-in-out_infinite] rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;