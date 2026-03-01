import { Link } from 'react-router-dom'

const FEATURES = [
    { icon: '🤖', title: 'Guiones con IA', desc: 'Gemini genera hooks de apertura, datos curiosos y posts de redes sociales para cada tema de forma automática.' },
    { icon: '🎙️', title: 'Voz Sintética', desc: 'ElevenLabs produce audio profesional con control de stability y similarity ajustable en tiempo real.' },
    { icon: '�️', title: 'Audio Completo', desc: 'ElevenLabs genera el audio completo del guion. Descárgalo directamente desde S3 con enlace válido por 7 días.' },
    { icon: '⚡', title: 'Batch Programado', desc: 'EventBridge automatiza la producción en lote. Configura el ritmo de generación según tus necesidades.' },
    { icon: '📊', title: 'Dashboard Central', desc: 'Controla el ciclo de vida de cada video: borrador, preview, aprobado y listo para publicar.' },
    { icon: '☁️', title: 'Serverless AWS', desc: 'S3 + CloudFront + Lambda + DynamoDB. Infraestructura que escala automáticamente, costo proporcional al uso.' },
]

const STEPS = [
    { num: '01', title: 'Define el tema', desc: 'Ingresa el tema o nicho de contenido que quieres cubrir.' },
    { num: '02', title: 'La IA genera el guion', desc: 'Gemini crea un guion optimizado para video corto con el hook y el mensaje clave.' },
    { num: '03', title: 'Preview y ajuste', desc: 'Escucha el audio completo, edita el guion y aprueba.' },
    { num: '04', title: 'Video listo', desc: 'El sistema ensambla el video final de forma automática y lo deja disponible.' },
]

export default function Home() {
    return (
        <div className="min-h-screen hero-gradient text-slate-900">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 backdrop-blur-sm sticky top-0 z-50 bg-white/80 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-lg shadow-neon-blue">
                        🎬
                    </div>
                    <span className="font-bold text-lg text-gradient">VideoBot AI</span>
                </div>
                <Link to="/login" className="btn-primary px-5 py-2 text-sm rounded-lg">
                    Acceder →
                </Link>
            </nav>

            {/* Hero */}
            <section className="relative px-6 py-24 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-blue/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-20 right-1/4 w-[400px] h-[300px] bg-neon-purple/6 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-sm px-4 py-2 rounded-full mb-6 animate-fade-in font-medium">
                        <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                        Gemini AI · ElevenLabs · AWS Serverless
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-slide-up text-slate-900">
                        Automatiza la creación<br />de <span className="text-gradient">videos con IA</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                        Plataforma serverless para producir contenido de voz con IA.
                        Guiones generados por IA, voz sintética y publicación programada.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <Link to="/login" className="btn-primary px-8 py-4 text-lg rounded-xl inline-flex items-center gap-2">
                            🚀 Ir al Dashboard
                        </Link>
                        <a href="#como-funciona" className="btn-secondary px-8 py-4 text-lg rounded-xl inline-flex items-center gap-2">
                            Cómo funciona ↓
                        </a>
                    </div>
                </div>
            </section>

            {/* Cómo funciona */}
            <section id="como-funciona" className="px-6 py-16 border-y border-slate-200/60 bg-white/60">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Del tema al video en minutos</h2>
                    <p className="text-slate-500 text-center mb-10 text-sm">Sin editar manualmente, sin grabar: solo define el tema y aprueba.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {STEPS.map(({ num, title, desc }) => (
                            <div key={num} className="text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-neon-blue/30 transition-all duration-300">
                                <div className="text-3xl font-extrabold text-gradient mb-2">{num}</div>
                                <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-3">Todo integrado, listo para usar</h2>
                    <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
                        Arquitectura serverless en AWS desplegada con Terraform. Cada componente trabaja en conjunto de forma automática.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map(({ icon, title, desc }) => (
                            <div key={title} className="card-accent p-6 hover:translate-y-[-4px] transition-transform duration-300 group">
                                <div className="text-3xl mb-3">{icon}</div>
                                <h3 className="font-semibold text-lg mb-2 text-slate-900 group-hover:text-neon-blue transition-colors">{title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-20 text-center">
                <div className="max-w-2xl mx-auto card p-12 border border-neon-blue/20 glow-blue">
                    <div className="text-5xl mb-4">🎬</div>
                    <h2 className="text-3xl font-bold mb-3 text-slate-900">¿Listo para automatizar?</h2>
                    <p className="text-slate-500 mb-8">Accede al dashboard y genera tu primer video con IA en minutos.</p>
                    <Link to="/login" className="btn-primary px-10 py-4 text-lg rounded-xl inline-flex items-center gap-2">
                        🚀 Comenzar ahora
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 px-6 py-8 text-center text-slate-400 text-sm bg-white/60">
                VideoBot AI · Plataforma privada · AWS Serverless · Powered by Terraform 🏗️
            </footer>
        </div>
    )
}
