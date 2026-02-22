export default function VoiceSliders({ settings, onChange, onProbar, isPlaying, loading }) {
    return (
        <div className="space-y-5">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                🎙️ Configuración de Voz
            </h3>

            {/* Stability */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-slate-400 font-medium">Stability (Estabilidad)</label>
                    <span className="text-xs font-mono bg-dark-900 px-2 py-0.5 rounded text-neon-blue">
                        {settings.stability.toFixed(2)}
                    </span>
                </div>
                <input
                    id="slider-stability"
                    type="range"
                    min="0.3" max="0.7" step="0.01"
                    value={settings.stability}
                    onChange={e => onChange({ ...settings, stability: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-neon-blue [&::-webkit-slider-thumb]:shadow-neon-blue
                     [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-125"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>0.3 (Más natural)</span>
                    <span>0.7 (Más estable)</span>
                </div>
            </div>

            {/* Similarity */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-slate-400 font-medium">Similarity (Similitud a tu voz)</label>
                    <span className="text-xs font-mono bg-dark-900 px-2 py-0.5 rounded text-neon-purple">
                        {settings.similarity.toFixed(2)}
                    </span>
                </div>
                <input
                    id="slider-similarity"
                    type="range"
                    min="0.5" max="0.9" step="0.01"
                    value={settings.similarity}
                    onChange={e => onChange({ ...settings, similarity: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-neon-purple [&::-webkit-slider-thumb]:shadow-neon-purple
                     [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-125"
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>0.5 (Menos parecido)</span>
                    <span>0.9 (Muy parecido)</span>
                </div>
            </div>

            {/* Botón probar */}
            <button
                id="btn-probar-voz"
                onClick={onProbar}
                disabled={loading}
                className="w-full btn-secondary py-3 flex items-center justify-center gap-2 rounded-xl border-neon-blue/30"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
                        Generando muestra...
                    </>
                ) : isPlaying ? (
                    <>
                        <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                        ⏸️ Reproduciendo...
                    </>
                ) : (
                    '🎧 Probar 10 segundos'
                )}
            </button>
        </div>
    )
}
