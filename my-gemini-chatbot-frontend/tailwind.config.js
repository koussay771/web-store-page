/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- Add this new section ---
      keyframes: {
        bounceOnce: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '20%': {
            transform: 'translateY(-6px)',
          },
          '40%': {
            transform: 'translateY(0)',
          },
          '60%': {
            transform: 'translateY(-3px)',
          },
          '80%': {
            transform: 'translateY(0)',
          },
        }
      },
      animation: {
        'bounce-once': 'bounceOnce 1s ease-in-out 1', // Runs only once
      }
      // --- End of new section ---
    },
  },
  plugins: [],
}