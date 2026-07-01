// Data tách riêng khỏi JSX -> thêm/sửa/xoá 1 dòng thông số chỉ cần sửa mảng này,
// không phải copy-paste cả khối div grid mỗi lần
const SPECS = [
  { label: 'Cảm biến', value: 'APS-C Exmor R CMOS 26.0 Megapixel' },
  { label: 'Bộ xử lý hình ảnh', value: 'BIONZ XR™ & AI Processing Unit' },
  { label: 'Hệ thống Lấy nét', value: 'AF theo pha 759 điểm (Độ phủ 93%)' },
  { label: 'Định dạng Video quay', value: '4K 120p / FHD 240p (10-bit 4:2:2 All-I)' },
  { label: 'Hệ thống chống rung (IBIS)', value: 'Cơ học 5 trục (Bù trừ 5.0 step) + Active Mode' },
  { label: 'Ống kính đi kèm (Bản M)', value: 'Sony E 18-135mm f/3.5-5.6 OSS' },
];

const Specs = () => {
  return (
    <section id="specs" className="py-32 px-6 max-w-4xl mx-auto">
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-amber-500 font-bold">Thông số kỹ thuật</h2>
          <p className="text-3xl font-bold tracking-tight">Chi Tiết Cấu Hình A6700M</p>
        </div>

        {/* dùng <dl> thay vì div thường: đây về ngữ nghĩa là danh sách "thuật ngữ - định nghĩa" (label - value) */}
        <dl className="border-t border-zinc-800 divide-y divide-zinc-900 text-sm">
          {SPECS.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-2 py-5">
              <dt className="text-zinc-400 font-light">{label}</dt>
              <dd className="font-bold text-right md:text-left">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Specs;