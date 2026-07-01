import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // Bỏ qua thư mục build — không lint code đã compile
  globalIgnores(['dist']),

  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended, // rule JS cơ bản (no-undef, no-unused-vars, ...)
      reactHooks.configs.flat.recommended, // rules of hooks + exhaustive-deps
      reactRefresh.configs.vite, // đảm bảo file tương thích Fast Refresh của Vite
    ],
    languageOptions: {
      // globals.browser: cung cấp các biến môi trường trình duyệt (window, document, ...)
      // để ESLint không báo "no-undef" nhầm cho các API browser
      globals: globals.browser,
      ecmaVersion: 'latest', // khai báo rõ ràng thay vì phụ thuộc giá trị mặc định của ESLint,
      // tránh trường hợp version ESLint cũ hơn có default khác gây thiếu hỗ trợ cú pháp JS mới
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Cho phép đặt tên biến/tham số không dùng tới với tiền tố "_"
      // (quy ước phổ biến khi cần giữ đúng thứ tự tham số nhưng không dùng hết, VD: (_, index) => ...)
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  {
    // Báo lỗi nếu có comment "eslint-disable" thừa không còn tác dụng (VD: sau khi sửa code
    // nhưng quên xoá dòng disable) -> giữ codebase sạch, tránh disable "mồ côi" không rõ lý do
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
]);