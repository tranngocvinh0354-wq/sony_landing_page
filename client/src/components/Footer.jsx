const Footer = () => {
  // Lấy năm hiện tại tự động từ hệ thống máy tính
  const currentYear = new Date().getFullYear(); 

  // Giao diện phần chân trang (Footer) nằm ở cuối website
  return (
    <footer className="py-12 border-t border-zinc-950 text-center text-xs text-zinc-600 bg-black">
      {/* Thông tin bản quyền của thương hiệu */}
      <p>© {currentYear} SONY ELECTRONICS VIETNAM.</p>
      
      {/* Thông tin đánh dấu bản quyền dự án cá nhân của ứng viên */}
      <p className="mt-2 text-zinc-700">
        Dự án Landing Page Mockup thiết kế bởi Trần Ngọc Vinh (TP.HCM).
      </p>
    </footer>
  );
};

export default Footer;