import React, { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';

// Áp dụng Lazy Load cho các component nằm bên dưới hoặc không hiển thị ngay lập tức
const Features = lazy(() => import('./sections/Features'));
const ProductShowcase = lazy(() => import('./sections/ProductShowcase'));
const Specs = lazy(() => import('./sections/Specs'));
const Subscribe = lazy(() => import('./sections/Subscribe'));
const Footer = lazy(() => import('./components/Footer'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const FloatingCart = lazy(() => import('./components/FloatingCart'));

function App() {
  return (
    <div className="bg-luxuryBlack text-zinc-100 min-h-screen font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Ưu tiên tải ngay lập tức phần đầu trang */}
      <Navbar />
      <Hero />
      
      {/* 2. Bọc các component tải ngầm bằng Suspense */}
      <Suspense fallback={<div className="text-center py-20 text-zinc-400">Đang tải dữ liệu...</div>}>
        <Features />
        <ProductShowcase />
        <Specs />
        <Subscribe />
        <Footer />
        <Chatbot />
        <FloatingCart />
      </Suspense>
    </div>
  );
}

export default App;