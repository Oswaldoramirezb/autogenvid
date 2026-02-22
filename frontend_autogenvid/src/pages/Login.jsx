import { useState } from 'react'
import { signInWithRedirect } from 'aws-amplify/auth'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export default function Login() {
    const [loading, setLoading] = useState(false)

    async function handleLogin() {
        setLoading(true)
        if (USE_MOCK) {
            // En modo mock, redirigir directamente al dashboard
            window.location.href = '/dashboard'
            return
        }
        try {
            await signInWithRedirect({ provider: 'COGNITO' })
        } catch (err) {
            console.error('Error login:', err)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen hero-gradient flex items-center justify-center p-4 relative overflow-hidden">
            {/* Orbes decorativos */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />

            {/* Card de login */}
            <div className="relative z-10 w-full max-w-md animate-fade-in">
                <div className="card p-8 border border-neon-blue/20 glow-blue">
                    {/* Logo / Icono */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center mb-4 animate-float shadow-neon-blue">
                            <span className="text-4xl">🎬</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gradient mb-1">VideoBot AI</h1>
                        <p className="text-slate-400 text-sm">Plataforma de generación automatizada de videos</p>
                    </div>

                    {/* Características rápidas */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {[
                            { icon: '🤖', label: 'IA Generativa' },
                            { icon: '🎙️', label: 'Voz Clonada' },
                            { icon: '🎬', label: '1K Videos' },
                        ].map(({ icon, label }) => (
                            <div key={label} className="flex flex-col items-center gap-1 bg-dark-900/50 rounded-xl p-3 border border-dark-700">
                                <span className="text-2xl">{icon}</span>
                                <span className="text-xs text-slate-400 font-medium">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Botón de login */}
                    <button
                        id="btn-login-cognito"
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full btn-primary py-4 text-base flex items-center justify-center gap-3 rounded-xl"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Conectando con Cognito...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                {USE_MOCK ? 'Entrar (Modo Demo)' : 'Iniciar sesión con Cognito'}
                            </>
                        )}
                    </button>

                    {USE_MOCK && (
                        <p className="text-center text-xs text-neon-yellow/70 mt-4 bg-neon-yellow/5 rounded-lg py-2 px-3 border border-neon-yellow/20">
                            ⚡ Modo Demo activo — No se requiere Cognito configurado
                        </p>
                    )}

                    <p className="text-center text-xs text-slate-500 mt-6">
                        Plataforma privada · Solo acceso autorizado
                    </p>
                </div>
            </div>
        </div>
    )
}
