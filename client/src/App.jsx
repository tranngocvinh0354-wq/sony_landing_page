import React from 'react';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import Features from './sections/Features';
import ProductShowcase from './sections/ProductShowcase';
import Specs from './sections/Specs';
import Subscribe from './sections/Subscribe';

function App() {
  return (
    <div className="bg-luxuryBlack text-zinc-100 min-h-screen font-sans selection:bg-amber-500 selection:text-black">
      <Navbar />
      <Hero />
      <Features />
      <ProductShowcase />
      <Specs />
      <Subscribe />
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;