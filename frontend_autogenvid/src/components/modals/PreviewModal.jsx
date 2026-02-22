import { useState, useRef, useEffect } from 'react'
import VoiceSliders from '../voice/VoiceSliders'
import FondoPicker from '../media/FondoPicker'
import VideoPlayer from '../media/VideoPlayer'
import { generarPreview, actualizarVideo, generarVideo, eliminarVideo } from '../../services/api'

const TABS = [
    { id: 'guion', label: '📝 Guion' },
    { id: 'voz', label: '🎙️ Voz' },
    { id: 'fondos', label: '🎞️ Fondos' },
    { id: 'video', label: '🎬 Video' },
]

export default function PreviewModal({ video, onClose, onVideoUpdate }) {
    const [tab, setTab] = useState('guion')
    const [vozSettings, setVozSettings] = useState(video.vozSettings || { stability: 0.5, similarity: 0.7 })
    const [modo, setModo] = useState('video')
    const [fondosSel, setFondosSel] = useState([])
    const [previewData, setPreviewData] = useState(null)
    const [loadingPreview, setLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [loadingVideo, setLoadingVideo] = useState(false)
    const [videoGenerado, setVideoGen] = useState(video.videoUrl || null)
    const audioRef = useRef(null)

    // si ya tiene audio guardado
    useEffect(() => {
        if (video.sampleAudio) setPreviewData({ sampleAudioUrl: video.sampleAudio })
    }, [])

    async function handleProbarVoz() {
        setLoading(true)
        try {
            const data = await generarPreview(video.id, modo, vozSettings.stability, vozSettings.similarity)
            setPreviewData(data)
            onVideoUpdate && onVideoUpdate()
            playAudio(data.sampleAudioUrl)
        } finally {
            setLoading(false)
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

    async function handleAprobar() {
        await actualizarVideo(video.id, { estado: 'aprobado', vozSettings, fondos: fondosSel.map(f => f.thumbUrl) })
        onVideoUpdate && onVideoUpdate()
        onClose()
    }

    async function handleGenerarVideo() {
        setLoadingVideo(true)
        try {
            const result = await generarVideo(video.id, fondosSel.map(f => f.fullUrl), vozSettings.stability)
            setVideoGen(result.videoUrl)
            onVideoUpdate && onVideoUpdate()
            setTab('video')
        } finally {
            setLoadingVideo(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-dark-800 border border-dark-700 rounded-2xl shadow-3xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700 bg-gradient-to-r from-dark-800 to-dark-900 shrink-0">
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-slate-100 text-sm truncate">{video.tema}</h2>
                        <p className="text-[10px] text-slate-500 mt-0.5">ID: {video.id.slice(0, 8)}...</p>
                    </div>
                    <button
                        id="btn-cerrar-modal"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors ml-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-dark-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-dark-700 shrink-0">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            id={`tab-${t.id}`}
                            onClick={() => setTab(t.id)}
                            className={`flex-1 py-3 text-xs font-medium transition-all duration-200 ${tab === t.id
                                    ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-dark-700/30'
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
                            <h3 className="text-sm font-semibold text-slate-300">📝 Guion Generado</h3>
                            <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                                {video.guion || 'Guion pendiente...'}
                            </div>
                            {video.postRedes && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-slate-400">📢 Posts para Redes Sociales</h4>
                                    {Object.entries(video.postRedes).map(([red, texto]) => (
                                        <div key={red} className="bg-dark-900/30 rounded-lg p-3 border border-dark-700">
                                            <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">
                                                {red === 'twitter' ? '𝕏 Twitter' : red === 'instagram' ? '📸 Instagram' : red === 'tiktok' ? '🎵 TikTok' : '💼 LinkedIn'}
                                            </p>
                                            <p className="text-xs text-slate-300">{texto}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 mb-2">🔗 Fuentes ({video.fuentes?.length || 0})</h4>
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
                                    <p className="text-xs text-neon-green mb-2">✓ Audio de muestra listo</p>
                                    <button
                                        onClick={() => playAudio(previewData.sampleAudioUrl)}
                                        className="btn-secondary text-xs px-4 py-2 rounded-lg"
                                    >
                                        ▶️ Reproducir de nuevo
                                    </button>
                                </div>
                            )}
                            <audio ref={audioRef} className="hidden" />
                        </div>
                    )}

                    {/* Pestaña Fondos */}
                    {tab === 'fondos' && (
                        <div className="animate-fade-in">
                            <FondoPicker
                                modo={modo}
                                onModoChange={setModo}
                                fondosSeleccionados={fondosSel}
                                onSeleccion={setFondosSel}
                            />
                        </div>
                    )}

                    {/* Pestaña Video */}
                    {tab === 'video' && (
                        <div className="animate-fade-in">
                            {videoGenerado ? (
                                <VideoPlayer videoUrl={videoGenerado} onClose={onClose} />
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-5xl mb-4">🎬</div>
                                    <p className="text-slate-400 text-sm mb-6">
                                        {fondosSel.length === 0
                                            ? 'Selecciona fondos en la pestaña Fondos para generar el video'
                                            : `${fondosSel.length} fondo(s) seleccionado(s). ¡Listo para generar!`}
                                    </p>
                                    <button
                                        id="btn-generar-video-modal"
                                        onClick={handleGenerarVideo}
                                        disabled={loadingVideo || fondosSel.length === 0}
                                        className="btn-primary px-8 py-4 rounded-xl flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingVideo ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Generando video (simulando ffmpeg)...
                                            </>
                                        ) : '⚡ Generar Video Ahora'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer con acciones */}
                <div className="px-6 py-4 border-t border-dark-700 flex items-center gap-3 shrink-0 bg-dark-900/30">
                    <button
                        id="btn-modal-aprobar"
                        onClick={handleAprobar}
                        className="btn-success flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2"
                    >
                        ✅ Aprobar para Batch
                    </button>
                    <button onClick={onClose} className="btn-secondary px-5 py-2.5 rounded-xl">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}
