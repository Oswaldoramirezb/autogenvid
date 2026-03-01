import StatusBadge from '../ui/StatusBadge'

const ESTADO_ACCIONES = {
    pendiente: ['preview', 'delete'],
    preview: ['edit', 'delete'],
    aprobado: ['edit', 'delete'],
    generando: [],
    listo: ['delete'],
    error: ['preview', 'delete'],
}

export default function TextCard({ video, onPreview, onEliminar, onEdit }) {
    const acciones = ESTADO_ACCIONES[video.estado] || []
    const fechaFormateada = video.fechaObjetivo
        ? new Date(video.fechaObjetivo + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—'

    return (
        <div className="card-accent p-5 flex flex-col gap-3 group animate-slide-up">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900 text-sm leading-snug flex-1 line-clamp-2 group-hover:text-neon-blue transition-colors">
                    {video.tema}
                </h3>
                <StatusBadge estado={video.estado} />
            </div>

            {/* Guion preview */}
            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                {video.guion || 'Guion pendiente de generación...'}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>📅 {fechaFormateada}</span>
                {video.vozSettings && (
                    <span>🎙️ {video.vozSettings.stability} / {video.vozSettings.similarity}</span>
                )}
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap gap-1.5 pt-1">
                {acciones.includes('preview') && (
                    <button
                        id={`btn-preview-${video.id}`}
                        onClick={() => onPreview(video)}
                        className="btn-secondary text-xs px-3 py-1.5 rounded-md flex items-center gap-1"
                        title="Generar preview de voz y fondos"
                    >
                        👁️ Preview
                    </button>
                )}
                {acciones.includes('edit') && (
                    <button
                        id={`btn-edit-${video.id}`}
                        onClick={() => onEdit(video)}
                        className="btn-secondary text-xs px-3 py-1.5 rounded-md flex items-center gap-1"
                        title="Editar guion"
                    >
                        ✏️ Editar
                    </button>
                )}
                {acciones.includes('delete') && (
                    <button
                        id={`btn-delete-${video.id}`}
                        onClick={() => onEliminar(video.id)}
                        className="btn-danger text-xs px-3 py-1.5 rounded-md flex items-center gap-1 ml-auto"
                        title="Eliminar"
                    >
                        🗑️
                    </button>
                )}
            </div>
        </div>
    )
}
