import { useState, useCallback } from 'react';

// Tách data ra khỏi JSX -> dễ thêm/sửa/xoá mục menu mà không phải lặp code
const NAV_LINKS = [
  { id: 'features', label: 'Công nghệ AI' },
  { id: 'product-showcase', label: 'Thiết kế' },
  { id: 'specs', label: 'Thông số' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hàm scroll dùng chung, tránh lặp lại document.getElementById(...) 4 lần
  const scrollToSection = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false); // đóng menu mobile sau khi chọn mục
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-luxuryBlack/80 border-b border-zinc-900 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 flex items-center gap-1">
          <span className="text-amber-500 text-2xl">α</span> 6700M
        </span>

        {/* Menu desktop */}
        <div className="hidden md:flex space-x-8 text-sm tracking-wide text-zinc-400 font-medium">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="hover:text-amber-500 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollToSection('subscribe-section')}
            className="border border-zinc-700 hover:border-amber-500 hover:text-amber-500 px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all duration-300"
          >
            Đặt Trước
          </button>

          {/* Nút hamburger: trước đây không có -> mobile không truy cập được menu */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={isMenuOpen}
            className="md:hidden text-zinc-300 hover:text-amber-500 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile dạng dropdown, chỉ hiện khi isMenuOpen = true */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-2 flex flex-col gap-4 text-sm tracking-wide text-zinc-400 font-medium">
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="hover:text-amber-500 transition-colors text-left"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;