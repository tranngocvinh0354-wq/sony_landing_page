import { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('sony_cart')) || []);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('sony_favs')) || []);
  const [viewed, setViewed] = useState(() => JSON.parse(localStorage.getItem('sony_viewed')) || []);

  useEffect(() => localStorage.setItem('sony_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('sony_favs', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('sony_viewed', JSON.stringify(viewed)), [viewed]);

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

  const updateQuantity = (productId, delta) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity >= 1 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Hàm dọn dẹp giỏ hàng sau khi thanh toán thành công
  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const isFav = prev.some((item) => item.id === product.id);
      return isFav ? prev.filter((item) => item.id !== product.id) : [...prev, product];
    });
  };

  const addViewedProduct = (product) => {
    setViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      return [product, ...filtered].slice(0, 5); 
    });
  };

  return (
    // Đã bổ sung clearCart vào value
    <ShopContext.Provider value={{ cart, favorites, viewed, addToCart, toggleFavorite, addViewedProduct, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);