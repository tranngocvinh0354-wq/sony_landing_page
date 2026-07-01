/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        luxuryBlack: "#09090b", // Đen chiều sâu
        luxuryCard: "#121214",  // Đen bề mặt card
        goldAccent: "#fbbf24",  // Vàng Champagne cao cấp (amber-400)
      },
      fontFamily: {
        // Sử dụng font chữ thanh lịch, hiện đại
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'], 
      },
      letterSpacing: {
        widest: '.2em', // Phục vụ cho các tiêu đề uppercase kiểu xa xỉ
      },
      // Thêm keyframes để xử lý hiệu ứng ảnh bay lơ lửng
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}