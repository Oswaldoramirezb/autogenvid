/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                // Paleta clara VideoBot AI
                dark: {
                    950: '#edf2ff',   // fondo base tintado
                    900: '#f0f4ff',   // fondo página
                    800: '#ffffff',   // cards / superficies
                    700: '#e2e8f0',   // bordes ligeros
                    600: '#94a3b8',   // elementos muted
                },
                neon: {
                    blue: '#3b82f6',
                    indigo: '#6366f1',
                    cyan: '#06b6d4',
                    purple: '#8b5cf6',
                    pink: '#ec4899',
                    green: '#10b981',
                    yellow: '#f59e0b',
                    red: '#ef4444',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'neon-blue': '0 0 20px rgba(59, 130, 246, 0.4)',
                'neon-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
                'neon-green': '0 0 20px rgba(16, 185, 129, 0.4)',
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.6)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'shake': 'shake 0.5s ease-in-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.4s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%': { transform: 'translateX(-6px)' },
                    '40%': { transform: 'translateX(6px)' },
                    '60%': { transform: 'translateX(-4px)' },
                    '80%': { transform: 'translateX(4px)' },
                },
                glow: {
                    from: { boxShadow: '0 0 10px rgba(59,130,246,0.3)' },
                    to: { boxShadow: '0 0 30px rgba(59,130,246,0.8), 0 0 60px rgba(59,130,246,0.3)' },
                },
                slideUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-neon': 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f0f4ff 100%)',
                'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,244,255,0.9) 100%)',
            },
        },
    },
    plugins: [],
}
