/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            blockquote: {
              fontStyle: 'italic',
              borderLeftWidth: '4px',
              borderLeftColor: '#e5e7eb', // gray-200
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              position: 'relative',
              backgroundColor: 'rgba(229, 231, 235, 0.1)', // light gray background
              borderRadius: '0.25rem',
              '& p:first-of-type::before': {
                content: 'none',
              },
              '& p:last-of-type::after': {
                content: 'none',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 