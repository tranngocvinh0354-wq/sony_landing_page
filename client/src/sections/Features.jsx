import { motion } from 'framer-motion';

// Tách nội dung ra khỏi JSX -> sửa/thêm/xoá tính năng chỉ cần sửa mảng, không đụng phần render
const FEATURES = [
  {
    number: '01',
    title: 'Lấy Nét Tự Động Bằng AI',
    description:
      'Bộ xử lý AI chuyên dụng nhận diện dáng điệu con người, động vật, chim, xe cộ và cả côn trùng. Bám nét thời gian thực cực kỳ chuẩn xác.',
  },
  {
    number: '02',
    title: 'Cảm Biến Exmor R™ 26.0MP',
    description:
      'Cảm biến APS-C chiếu sáng đa chiều thế hệ mới kết hợp chip BIONZ XR mang lại dải nhạy sáng rộng, độ nhiễu cực thấp.',
  },
  {
    number: '03',
    title: 'Quay Phim 4K 120p',
    description:
      'Kế thừa hồ sơ màu S-Cinetone từ dòng máy quay Cinema Line. Ghi hình 4K 120p mượt mà giúp thỏa sức sáng tạo slow-motion.',
  },
];

// Delay tăng dần theo index (0.1, 0.3, 0.5) -> tính bằng công thức thay vì gõ tay từng số
const BASE_DELAY = 0.1;
const DELAY_STEP = 0.2;

const Features = () => {
  return (
    <section id="features" className="py-32 px-6 bg-zinc-950/40 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-amber-500 font-bold">Đột phá công nghệ</h2>
          <p className="text-3xl md:text-4xl font-bold tracking-tight">Sức Mạnh Từ Trí Tuệ Nhân Tạo</p>
          <div className="w-12 h-[2px] bg-amber-500 mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map(({ number, title, description }, index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: BASE_DELAY + index * DELAY_STEP }}
              viewport={{ once: true }}
              className="bg-luxuryCard border border-zinc-900 p-8 rounded-2xl hover:border-zinc-800 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-amber-500 text-xl font-bold mb-6 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                {number}
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;