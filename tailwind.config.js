/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                wedding: {
                    50: '#faf5f0',
                    100: '#f5ebe0',
                    200: '#ead6c1',
                    300: '#dfc2a2',
                    400: '#d4ad83',
                    500: '#c99864',
                    600: '#bd8345',
                    700: '#b16e26',
                    800: '#a5591f',
                    900: '#994418',
                },
            },
        },
    },
    plugins: [],
    corePlugins: {
        // Desactiva plugins de Tailwind que no uses
        aspectRatio: true,
        backdropBlur: true,
        backdropBrightness: true,
    },
}
