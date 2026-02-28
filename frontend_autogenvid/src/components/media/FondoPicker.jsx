import { useState } from 'react'
import { buscarFondos } from '../../services/api'
import { MOCK_FONDOS_VIDEO, MOCK_FONDOS_FOTO } from '../../services/mocks'

export default function FondoPicker({ modo, onModoChange, fondosSeleccionados, onSeleccion }) {
    const [buscando, setBuscando] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [fondos, setFondos] = useState(modo === 'video' ? MOCK_FONDOS_VIDEO : MOCK_FONDOS_FOTO)

    async function handleModoChange(nuevoModo) {
        onModoChange(nuevoModo)
        setFondos(nuevoModo === 'video' ? MOCK_FONDOS_VIDEO : MOCK_FONDOS_FOTO)
        setKeyword('')
    }

    async function handleBuscar() {
        if (!keyword.trim()) {
            setFondos(modo === 'video' ? MOCK_FONDOS_VIDEO : MOCK_FONDOS_FOTO)
            return
        }
        setBuscando(true)
        try {
            const resultados = await buscarFondos(keyword.trim(), modo)
            setFondos(resultados.length > 0 ? resultados : (modo === 'video' ? MOCK_FONDOS_VIDEO : MOCK_FONDOS_FOTO))
        } finally {
            setBuscando(false)
        }
    }

    function toggleFondo(fondo) {
        const estaSeleccionado = fondosSeleccionados.some(f => f.id === fondo.id)
        if (estaSeleccionado) {
            onSeleccion(fondosSeleccionados.filter(f => f.id !== fondo.id))
        } else {
            onSeleccion([...fondosSeleccionados, fondo])
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">🎞️ Fondos del Video</h3>
                <span className="text-xs text-slate-500">{fondosSeleccionados.length} seleccionados</span>
            </div>

            {/* Toggle Video / Foto */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                    id="btn-toggle-video"
                    onClick={() => handleModoChange('video')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${modo === 'video'
                        ? 'bg-neon-blue text-white shadow-neon-blue'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    📹 Video
                </button>
                <button
                    id="btn-toggle-foto"
                    onClick={() => handleModoChange('foto')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${modo === 'foto'
                        ? 'bg-neon-purple text-white shadow-neon-purple'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    🖼️ Foto
                </button>
            </div>

            {/* Buscador */}
            <div className="flex gap-2">
                <input
                    id="input-buscar-fondos"
                    type="text"
                    placeholder="Buscar fondo (ej: espacio, ciudad, naturaleza...)"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                    className="input-dark text-sm"
                />
                <button
                    onClick={handleBuscar}
                    disabled={buscando}
                    className="btn-secondary px-3 py-2 rounded-lg text-sm whitespace-nowrap"
                >
                    {buscando ? '...' : '🔍'}
                </button>
            </div>

            {/* Grid de fondos */}
            <div className="grid grid-cols-3 gap-2">
                {fondos.map(fondo => {
                    const seleccionado = fondosSeleccionados.some(f => f.id === fondo.id)
                    return (
                        <button
                            key={fondo.id}
                            id={`btn-fondo-${fondo.id}`}
                            onClick={() => toggleFondo(fondo)}
                            className={`relative rounded-xl overflow-hidden aspect-video group transition-all duration-200 ${seleccionado
                                ? 'ring-2 ring-neon-blue shadow-neon-blue scale-105'
                                : 'ring-1 ring-slate-300 hover:ring-neon-blue/50 hover:scale-105'
                                }`}
                        >
                            <img
                                src={fondo.thumbUrl}
                                alt={fondo.keyword}
                                className="w-full h-full object-cover"
                                onError={e => { e.target.src = 'https://placehold.co/300x150/1e293b/3b82f6?text=Fondo' }}
                            />
                            {/* Overlay con keyword */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="absolute bottom-1 left-1 text-[10px] text-white font-medium px-1.5 py-0.5 bg-black/60 rounded">
                                    {fondo.keyword}
                                </span>
                            </div>
                            {seleccionado && (
                                <div className="absolute inset-0 bg-neon-blue/20 flex items-center justify-center">
                                    <span className="text-lg">✓</span>
                                </div>
                            )}
                            <span className="absolute top-1 right-1 text-xs opacity-70">
                                {fondo.tipo === 'video' ? '📹' : '🖼️'}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
