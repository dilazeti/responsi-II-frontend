/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#EDF6FF',
        text: '#333333',
        accent: '#888888',
      },
      fontFamily: {
        spectral: ['Spectral', 'serif'],
      },
    },
  },
  plugins: [],
};
