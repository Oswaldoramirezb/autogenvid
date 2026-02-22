const ESTADO_CONFIG = {
    pendiente: { color: 'bg-slate-500/20 text-slate-300 border-slate-500/30', dot: 'bg-slate-400', label: 'Pendiente' },
    preview: { color: 'bg-neon-cyan/10 text-cyan-300 border-cyan-500/30', dot: 'bg-cyan-400', label: 'Preview' },
    aprobado: { color: 'bg-neon-blue/10 text-blue-300 border-blue-500/30', dot: 'bg-blue-400', label: 'Aprobado' },
    generando: { color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30', dot: 'bg-yellow-400 animate-pulse', label: 'Generando' },
    listo: { color: 'bg-neon-green/10 text-green-300 border-green-500/30', dot: 'bg-green-400', label: 'Listo ✓' },
    error: { color: 'bg-neon-red/10 text-red-300 border-red-500/30', dot: 'bg-red-400', label: 'Error' },
}

export default function StatusBadge({ estado }) {
    const config = ESTADO_CONFIG[estado] || ESTADO_CONFIG.pendiente
    return (
        <span className={`badge border ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    )
}
