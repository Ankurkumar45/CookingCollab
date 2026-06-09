/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                herb: {
                    50: '#E1F5EE',
                    100: '#9FE1CB',
                    400: '#1D9E75',
                    600: '#0F6E56',
                    900: '#04342C',
                },
                saffron: {
                    50: '#FAEEDA',
                    200: '#FAC775',
                    400: '#EF9F27',
                    700: '#854F0B',
                },
                paprika: {
                    50: '#FAECE7',
                    200: '#F0997B',
                    400: '#D85A30',
                    700: '#993C1D',
                },
                stone: {
                    50: '#F1EFE8',
                    100: '#E8E6DF',
                    200: '#D3D1C7',
                    400: '#888780',
                    600: '#5F5E5A',
                    900: '#2C2C2A',
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                xl: '0.75rem',
                '2xl': '1rem',
            },
        },
    },
    plugins: [],
};