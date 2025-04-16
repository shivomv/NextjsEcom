/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6602C2", // Deep purple from gradient
          dark: "#030005",
          light: "#BA05BE",
          50: "#F3E5FF",
          100: "#E1BEFF",
          200: "#C77DFF",
          300: "#AD4BFF",
          400: "#9931FF",
          500: "#8400FF",
          600: "#6602C2",
          700: "#4A0090",
          800: "#30005C",
          900: "#030005",
        },
        secondary: {
          DEFAULT: "#CD3907", // Orange from gradient
          dark: "#A52D06",
          light: "#FF6D3F",
          50: "#FFF3E0",
          100: "#FFE0B2",
          200: "#FFCC80",
          300: "#FFB74D",
          400: "#FFA726",
          500: "#FF9800",
          600: "#CD3907",
          700: "#A52D06",
          800: "#7C2105",
          900: "#541603",
        },
        accent: {
          DEFAULT: "#BA05BE", // Bright pink from gradient
          dark: "#8A048D",
          light: "#F54BF9",
          50: "#FCE4FF",
          100: "#F8BFFF",
          200: "#F392FF",
          300: "#ED65FF",
          400: "#E73DFF",
          500: "#E114FF",
          600: "#BA05BE",
          700: "#8A048D",
          800: "#5C035E",
          900: "#2E012F",
        },
        background: {
          DEFAULT: "#FFF0B7", // Light cream background
          dark: "#15202B",    // Dark blue background
          paper: "#FFFDF7",
          light: "#FFFDF7",
        },
        text: {
          DEFAULT: "#15202B", // Dark blue for text
          light: "#4A5568",
          dark: "#030005",   // Almost black for dark text
          muted: "#718096",
        },
        success: {
          DEFAULT: "#4CAF50",
          light: "#A5D6A7",
          dark: "#2E7D32",
        },
        error: {
          DEFAULT: "#F44336",
          light: "#EF9A9A",
          dark: "#C62828",
        },
        warning: {
          DEFAULT: "#FF9800",
          light: "#FFCC80",
          dark: "#EF6C00",
        },
        // Custom theme colors
        deepPurple: "#030005",  // Almost black purple
        brightPurple: "#6602C2", // Bright purple
        hotPink: "#BA05BE",     // Hot pink
        orange: "#CD3907",      // Vibrant orange
        cream: "#FFF0B7",       // Light cream
        darkBlue: "#15202B",    // Dark blue
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        hindi: ['Poppins', 'Noto Sans Devanagari', 'Hind', 'sans-serif'], // Enhanced Hindi text support
        heading: ['Poppins', 'var(--font-geist-sans)', 'sans-serif'],
        brand: ['Poppins', 'var(--font-geist-sans)', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
      screens: {
        'xs': '360px',  // Most small mobile phones
        'sm': '640px',  // Larger phones and small tablets
        'md': '768px',  // Tablets
        'lg': '1024px', // Small laptops
        'xl': '1280px', // Laptops and desktops
        '2xl': '1536px', // Large desktops
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
};
