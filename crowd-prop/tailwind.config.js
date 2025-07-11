/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Campaign type colors
    'border-orange-500',
    'bg-orange-50',
    'text-orange-700',
    'text-orange-600',
    'border-purple-500',
    'bg-purple-50',
    'text-purple-700',
    'text-purple-600',
    'border-blue-500',
    'bg-blue-50',
    'text-blue-700',
    'text-blue-600',
    'border-green-500',
    'bg-green-50',
    'text-green-700',
    'text-green-600',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Explicitly add light and outline colors for orange and purple
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#a21caf',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6d28d9',
        },
      },
    },
  },
  plugins: [],
}
