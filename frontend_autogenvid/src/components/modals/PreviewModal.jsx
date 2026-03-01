import { useState, useRef, useEffect } from 'react'
import VoiceSliders from '../voice/VoiceSliders'
import { generarPreview, regenerarGuion, guardarGuion } from '../../services/api'

const TABS = [
    { id: 'guion', label: '📝 Guion' },
    { id: 'voz', label: '🎤 Voz' },
]

export default function PreviewModal({ video, onClose, onVideoUpdate }) {
    const [tab, setTab] = useState('guion')
    const [vozSettings, setVozSettings] = useState(video.vozSettings || { stability: 0.5, similarity: 0.7 })
    const [previewData, setPreviewData] = useState(null)
    const [loadingPreview, setLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    // Guion editable localmente (no se guarda hasta Aprobar)
    const [editedGuion, setEditedGuion] = useState(video.guion || '')
    const [refinePrompt, setRefinePrompt] = useState('')
    const [loadingRefine, setLoadingRefine] = useState(false)
    const [refineError, setRefineError] = useState(null)
    const [savedGuion, setSavedGuion] = useState(video.guion || '')
    const [savingGuion, setSavingGuion] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const audioRef = useRef(null)

    // si ya tiene audio guardado
    useEffect(() => {
        if (video.sampleAudio) setPreviewData({ sampleAudioUrl: video.sampleAudio })
    }, [])

    async function handleProbarVoz() {
        setLoading(true)
        try {
            const data = await generarPreview(video.id, vozSettings.stability, vozSettings.similarity)
            setPreviewData(data)
            onVideoUpdate && onVideoUpdate()
            playAudio(data.sampleAudioUrl)
        } finally {
            setLoading(false)
        }
    }

    async function handleGuardarGuion() {
        setSavingGuion(true)
        setSaveSuccess(false)
        try {
            await guardarGuion(video.id, editedGuion)
            setSavedGuion(editedGuion)
            setSaveSuccess(true)
            onVideoUpdate && onVideoUpdate()
            setTimeout(() => setSaveSuccess(false), 3000)
        } finally {
            setSavingGuion(false)
        }
    }

    async function handleRefinar() {
        if (!refinePrompt.trim()) return
        setLoadingRefine(true)
        setRefineError(null)
        try {
            const customPrompt = `El guion actual es:\n"${editedGuion}"\n\nEl usuario quiere que lo modifiques así:\n"${refinePrompt}"\n\nReescribe el guion completo aplicando esas instrucciones. Mantén el mismo tono directo, sin introducción, arrancando con dato impactante. Devuelve el JSON completo con guion, fuentes y postRedes.`
            const result = await regenerarGuion(video.id, video.tema, customPrompt)
            setEditedGuion(result.guion || editedGuion)
            setRefinePrompt('')
            onVideoUpdate && onVideoUpdate()
        } catch (e) {
            setRefineError(e.message)
        } finally {
            setLoadingRefine(false)
        }
    }

    function playAudio(url) {
        if (audioRef.current) {
            audioRef.current.src = url || previewData?.sampleAudioUrl
            audioRef.current.currentTime = 0
            audioRef.current.play()
            setIsPlaying(true)
            // Solo 10 segundos
            setTimeout(() => {
                audioRef.current?.pause()
                setIsPlaying(false)
            }, 10000)
        }
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-3xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-slate-900 text-sm truncate">{video.tema}</h2>
                        <p className="text-[10px] text-slate-400 mt-0.5">ID: {video.id.slice(0, 8)}...</p>
                    </div>
                    <button
                        id="btn-cerrar-modal"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 transition-colors ml-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 shrink-0">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            id={`tab-${t.id}`}
                            onClick={() => setTab(t.id)}
                            className={`flex-1 py-3 text-xs font-medium transition-all duration-200 ${tab === t.id
                                ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Contenido scrolleable */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Pestaña Guion */}
                    {tab === 'guion' && (
                        <div className="space-y-4 animate-fade-in">
                            {/* Guion editable */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-700">📝 Guion</h3>
                                <div className="flex items-center gap-2">
                                    {editedGuion !== savedGuion && (
                                        <span className="text-[10px] text-amber-400">● Sin guardar</span>
                                    )}
                                    {saveSuccess && (
                                        <span className="text-[10px] text-neon-green">✓ Guardado</span>
                                    )}
                                    <span className="text-[10px] text-slate-500 italic">Editable — los cambios se usan al probar voz</span>
                                </div>
                            </div>
                            <textarea
                                value={editedGuion}
                                onChange={e => { setEditedGuion(e.target.value); setSaveSuccess(false) }}
                                rows={8}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 leading-relaxed resize-y focus:outline-none focus:border-neon-blue/50 transition-colors"
                                placeholder="Guion pendiente..."
                            />

                            {/* Botón guardar guion */}
                            <button
                                onClick={handleGuardarGuion}
                                disabled={savingGuion || editedGuion === savedGuion}
                                className="w-full py-2 rounded-lg text-xs flex items-center justify-center gap-2 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {savingGuion ? (
                                    <><div className="w-3 h-3 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />Guardando...</>
                                ) : saveSuccess ? '✓ Guion guardado en DynamoDB' : '💾 Guardar guion'}
                            </button>

                            {/* Sección refinar con IA */}
                            <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
                                <h4 className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                                    ✨ Pedir corrección a la IA
                                    <span className="text-slate-400 font-normal">— dile qué cambiar y regenerará el guion</span>
                                </h4>
                                <textarea
                                    value={refinePrompt}
                                    onChange={e => setRefinePrompt(e.target.value)}
                                    rows={3}
                                    placeholder='Ej: "Enfócate más en los animales del amazonas", "Añade datos sobre la tribu Yanomami", "Hazlo más dramático y con más cifras"...'
                                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 resize-none focus:outline-none focus:border-neon-purple/50 transition-colors placeholder:text-slate-400"
                                />
                                {refineError && (
                                    <p className="text-xs text-red-400">⚠️ {refineError}</p>
                                )}
                                <button
                                    onClick={handleRefinar}
                                    disabled={loadingRefine || !refinePrompt.trim()}
                                    className="btn-secondary w-full py-2 rounded-lg text-xs flex items-center justify-center gap-2 border-neon-purple/30 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {loadingRefine ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
                                            Regenerando guion...
                                        </>
                                    ) : '✨ Aplicar instrucción y regenerar'}
                                </button>
                            </div>

                            {/* Posts redes */}
                            {video.postRedes && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-slate-600">📢 Posts para Redes Sociales</h4>
                                    {Object.entries(video.postRedes).map(([red, texto]) => (
                                        <div key={red} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                            <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">
                                                {red === 'twitter' ? '𝕏 Twitter' : red === 'instagram' ? '📸 Instagram' : red === 'tiktok' ? '🎵 TikTok' : '💼 LinkedIn'}
                                            </p>
                                            <p className="text-xs text-slate-700">{texto}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div>
                                <h4 className="text-xs font-semibold text-slate-600 mb-2">🔗 Fuentes ({video.fuentes?.length || 0})</h4>
                                <div className="space-y-1 max-h-24 overflow-y-auto">
                                    {(video.fuentes || []).map((url, i) => (
                                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                            className="block text-xs text-neon-blue/70 hover:text-neon-blue truncate transition-colors">
                                            {i + 1}. {url}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pestaña Voz */}
                    {tab === 'voz' && (
                        <div className="animate-fade-in">
                            <VoiceSliders
                                settings={vozSettings}
                                onChange={setVozSettings}
                                onProbar={handleProbarVoz}
                                isPlaying={isPlaying}
                                loading={loadingPreview}
                            />
                            {previewData?.sampleAudioUrl && !loadingPreview && (
                                <div className="mt-4 p-3 bg-neon-green/5 border border-neon-green/20 rounded-xl">
                                    <p className="text-xs text-neon-green mb-2">✓ Audio listo</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => playAudio(previewData.sampleAudioUrl)}
                                            className="btn-secondary text-xs px-4 py-2 rounded-lg"
                                        >
                                            ▶️ Reproducir
                                        </button>
                                        <a
                                            href={previewData.sampleAudioUrl}
                                            download={`${video.tema.replace(/\s+/g, '_')}.mp3`}
                                            className="btn-primary text-xs px-4 py-2 rounded-lg flex items-center gap-1"
                                        >
                                            ⬇️ Descargar MP3
                                        </a>
                                    </div>
                                </div>
                            )}
                            <audio ref={audioRef} className="hidden" />
                        </div>
                    )}

                    {/* Pestaña Fondos y Video han sido eliminadas */}
                </div>

                {/* Footer con acciones */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center gap-3 shrink-0 bg-slate-50">
                    <button onClick={onClose} className="btn-secondary flex-1 py-2.5 rounded-xl">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}
