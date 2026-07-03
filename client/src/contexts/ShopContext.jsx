import { createContext, useContext, useState, useEffect } from 'react';

// Khởi tạo Context để chia sẻ dữ liệu e-commerce mini toàn ứng dụng
const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Khởi tạo state từ Local Storage (nếu có) để giữ dữ liệu khi F5 trang
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('sony_cart')) || []);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('sony_favs')) || []);
  const [viewed, setViewed] = useState(() => JSON.parse(localStorage.getItem('sony_viewed')) || []);

  // Tự động đồng bộ state xuống Local Storage mỗi khi có thay đổi
  useEffect(() => localStorage.setItem('sony_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('sony_favs', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('sony_viewed', JSON.stringify(viewed)), [viewed]);

  // Xử lý thêm sản phẩm vào giỏ hàng (Cộng dồn số lượng nếu đã tồn tại)
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert(`Đã thêm cấu hình "${product.label}" vào giỏ hàng!`);
  };

  // Xử lý Thêm/Xóa khỏi danh sách Yêu thích
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const isFav = prev.some((item) => item.id === product.id);
      return isFav ? prev.filter((item) => item.id !== product.id) : [...prev, product];
    });
  };

  // Xử lý lưu lịch sử xem (Giới hạn lưu 5 cấu hình gần nhất tránh đầy bộ nhớ)
  const addViewedProduct = (product) => {
    setViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      return [product, ...filtered].slice(0, 5); 
    });
  };

  return (
    <ShopContext.Provider value={{ cart, favorites, viewed, addToCart, toggleFavorite, addViewedProduct }}>
      {children}
    </ShopContext.Provider>
  );
};

// Hook tiện ích để các Component khác dễ dàng lấy dữ liệu từ kho
export const useShop = () => useContext(ShopContext);