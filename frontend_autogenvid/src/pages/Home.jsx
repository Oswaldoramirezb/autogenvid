import { Link } from 'react-router-dom'

const FEATURES = [
    { icon: '🤖', title: 'Guiones con IA', desc: 'Gemini genera hooks virales, datos curiosos y posts de redes sociales automáticamente.' },
    { icon: '🎙️', title: 'Voz Clonada', desc: 'ElevenLabs clona tu voz y genera audio profesional con control de stability y similarity.' },
    { icon: '🎬', title: 'Fondos Dinámicos', desc: 'Elige entre videos de Pexels o fotos de Unsplash. Toggle rápido y buscador integrado.' },
    { icon: '⚡', title: 'Batch Automático', desc: 'EventBridge dispara 5 videos diarios a las 8AM. Tú solo apruebas, la app genera.' },
    { icon: '📊', title: 'Dashboard Pro', desc: 'Visualiza el estado de tus 1,000 videos: pendiente, preview, aprobado, listo.' },
    { icon: '☁️', title: 'Serverless AWS', desc: 'S3 + CloudFront + Lambda + DynamoDB. Escala a cero cuando no usas, costo mínimo.' },
]

const STATS = [
    { value: '1,000', label: 'Videos Target' },
    { value: '5/día', label: 'Batch Automático' },
    { value: '60s', label: 'Duración objetivo' },
    { value: '100%', label: 'Serverless' },
]

export default function Home() {
    return (
        <div className="min-h-screen hero-gradient text-slate-100">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-dark-700/50 backdrop-blur-sm sticky top-0 z-50 bg-dark-900/80">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🎬</span>
                    <span className="font-bold text-lg text-gradient">VideoBot AI</span>
                </div>
                <Link to="/login" className="btn-primary px-5 py-2 text-sm rounded-lg">
                    Acceder →
                </Link>
            </nav>

            {/* Hero */}
            <section className="relative px-6 py-24 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
                        <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                        Powered by Gemini AI + ElevenLabs + AWS
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-slide-up">
                        Genera <span className="text-gradient">1,000 videos</span><br />con Inteligencia Artificial
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Plataforma serverless para automatizar la creación de videos YouTube y TikTok de 60 segundos.
                        Guiones IA, voz clonada, fondos dinámicos y batch diario automático.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <Link to="/login" className="btn-primary px-8 py-4 text-lg rounded-xl inline-flex items-center gap-2">
                            🚀 Acceder al Dashboard
                        </Link>
                        <a href="#features" className="btn-secondary px-8 py-4 text-lg rounded-xl inline-flex items-center gap-2">
                            Ver características ↓
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="px-6 py-12 border-y border-dark-700/50">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="text-center">
                            <div className="text-4xl font-extrabold text-gradient mb-1">{value}</div>
                            <div className="text-slate-400 text-sm">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-4">Todo lo que necesitas</h2>
                    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                        Arquitectura serverless en AWS. Todo gestionado con Terraform. Mocks listos para desarrollo.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map(({ icon, title, desc }) => (
                            <div key={title} className="card-accent p-6 hover:translate-y-[-4px] transition-transform duration-300">
                                <div className="text-3xl mb-3">{icon}</div>
                                <h3 className="font-semibold text-lg mb-2 text-slate-100">{title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-20 text-center">
                <div className="max-w-2xl mx-auto card p-12 border border-neon-blue/20 glow-blue">
                    <div className="text-5xl mb-4">🎬</div>
                    <h2 className="text-3xl font-bold mb-4">¿Listo para automatizar?</h2>
                    <p className="text-slate-400 mb-8">Accede al dashboard y empieza a generar tu primer video con IA en menos de 5 minutos.</p>
                    <Link to="/login" className="btn-primary px-10 py-4 text-lg rounded-xl inline-flex items-center gap-2">
                        🚀 Comenzar ahora
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-dark-700/50 px-6 py-8 text-center text-slate-500 text-sm">
                VideoBot AI · Plataforma privada · AWS Serverless · Powered by Terraform 🏗️
            </footer>
        </div>
    )
}
