import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/layout/Sidebar'
import TextCard from '../components/cards/TextCard'
import PreviewModal from '../components/modals/PreviewModal'
import VideoPlayer from '../components/media/VideoPlayer'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import StatusBadge from '../components/ui/StatusBadge'
import { listarVideos, generarGuion, actualizarVideo, eliminarVideo, generarVideo } from '../services/api'

const FILTROS_ESTADO = ['todos', 'pendiente', 'preview', 'aprobado', 'generando', 'listo', 'error']

export default function Dashboard() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [filtroEstado, setFiltro] = useState('todos')
    const [busqueda, setBusqueda] = useState('')
    const [modalVideo, setModalVideo] = useState(null)
    const [playerVideo, setPlayerVideo] = useState(null)
    const [creando, setCreando] = useState(false)
    const [temaInput, setTemaInput] = useState('')
    const [showNuevoForm, setShowNuevo] = useState(false)
    const [toast, setToast] = useState(null)

    function showToast(msg, tipo = 'success') {
        setToast({ msg, tipo })
        setTimeout(() => setToast(null), 3500)
    }

    const cargarVideos = useCallback(async () => {
        try {
            const data = await listarVideos()
            setVideos(data)
        } catch (err) {
            showToast('Error cargando videos: ' + err.message, 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { cargarVideos() }, [cargarVideos])

    async function handleGenerarGuion() {
        if (!temaInput.trim()) return
        setCreando(true)
        try {
            await generarGuion(temaInput.trim())
            setTemaInput('')
            setShowNuevo(false)
            await cargarVideos()
            showToast('✅ Guion generado correctamente')
        } catch (err) {
            showToast('Error generando guion: ' + err.message, 'error')
        } finally {
            setCreando(false)
        }
    }

    async function handleAprobar(video) {
        await actualizarVideo(video.id, { estado: 'aprobado' })
        await cargarVideos()
        showToast('✅ Video aprobado para batch diario')
    }

    async function handleEliminar(id) {
        if (!window.confirm('¿Eliminar este video?')) return
        await eliminarVideo(id)
        await cargarVideos()
        showToast('🗑️ Video eliminado')
    }

    async function handleGenerarVideo(video) {
        await generarVideo(video.id, video.fondos || [], video.vozSettings?.stability || 0.5)
        await cargarVideos()
        showToast('🎬 Video en cola de generación')
    }

    // Filtrado y búsqueda
    const videosFiltrados = videos.filter(v => {
        const pasaEstado = filtroEstado === 'todos' || v.estado === filtroEstado
        const pasaBusqueda = !busqueda || v.tema.toLowerCase().includes(busqueda.toLowerCase())
        return pasaEstado && pasaBusqueda
    })

    const countPorEstado = st => videos.filter(v => v.estado === st).length

    return (
        <div className="flex min-h-screen bg-dark-900">
            <Sidebar videos={videos} />

            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="px-6 py-4 border-b border-dark-700 bg-dark-800/50 backdrop-blur-sm sticky top-0 z-10 flex items-center gap-4">
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-slate-100">Dashboard de Videos</h1>
                        <p className="text-xs text-slate-500">{videos.length} videos · Mostrando {videosFiltrados.length}</p>
                    </div>

                    {/* Botón Nuevo */}
                    <button
                        id="btn-nuevo-video"
                        onClick={() => setShowNuevo(v => !v)}
                        className="btn-primary px-4 py-2 text-sm rounded-xl flex items-center gap-2"
                    >
                        ➕ Nuevo Video
                    </button>
                </header>

                {/* Formulario Nuevo Video (inline) */}
                {showNuevoForm && (
                    <div className="px-6 py-4 bg-dark-800/80 border-b border-neon-blue/20 animate-slide-up">
                        <div className="max-w-2xl flex gap-3">
                            <input
                                id="input-tema-nuevo"
                                type="text"
                                placeholder="Ingresa el tema del video (ej: Inteligencia Artificial 2026)..."
                                value={temaInput}
                                onChange={e => setTemaInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleGenerarGuion()}
                                className="input-dark text-sm flex-1"
                                autoFocus
                            />
                            <button
                                id="btn-generar-guion"
                                onClick={handleGenerarGuion}
                                disabled={creando || !temaInput.trim()}
                                className="btn-primary px-5 py-2 text-sm rounded-lg flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                            >
                                {creando ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Generando...
                                    </>
                                ) : '🤖 Generar Guion'}
                            </button>
                            <button onClick={() => setShowNuevo(false)} className="btn-secondary px-3 py-2 rounded-lg text-sm">✕</button>
                        </div>
                    </div>
                )}

                {/* Filtros */}
                <div className="px-6 py-3 border-b border-dark-700/50 flex items-center gap-3 flex-wrap bg-dark-900/30">
                    {/* Búsqueda */}
                    <input
                        id="input-buscar-videos"
                        type="text"
                        placeholder="Buscar por tema..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="input-dark text-xs py-1.5 max-w-48"
                    />

                    {/* Filtros de estado */}
                    <div className="flex gap-1 flex-wrap">
                        {FILTROS_ESTADO.map(e => (
                            <button
                                key={e}
                                id={`filtro-${e}`}
                                onClick={() => setFiltro(e)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 capitalize ${filtroEstado === e
                                        ? 'bg-neon-blue/20 border-neon-blue/50 text-neon-blue'
                                        : 'border-dark-600 text-slate-500 hover:text-slate-300 hover:border-dark-500'
                                    }`}
                            >
                                {e === 'todos' ? `Todos (${videos.length})` : `${e} (${countPorEstado(e)})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid de Videos */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <LoadingSkeleton count={6} />
                    ) : videosFiltrados.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="text-6xl mb-4">🎬</div>
                            <h3 className="text-xl font-semibold text-slate-400 mb-2">No hay videos</h3>
                            <p className="text-slate-500 text-sm max-w-sm">
                                {busqueda || filtroEstado !== 'todos'
                                    ? 'No se encontraron videos con esos filtros.'
                                    : 'Empieza creando tu primer video con el botón "+ Nuevo Video".'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {videosFiltrados.map(video => (
                                <TextCard
                                    key={video.id}
                                    video={video}
                                    onPreview={setModalVideo}
                                    onAprobar={handleAprobar}
                                    onGenerar={handleGenerarVideo}
                                    onEliminar={handleEliminar}
                                    onPlayer={setPlayerVideo}
                                    onEdit={setModalVideo}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal de Preview */}
            {modalVideo && (
                <PreviewModal
                    video={modalVideo}
                    onClose={() => { setModalVideo(null); cargarVideos() }}
                    onVideoUpdate={cargarVideos}
                />
            )}

            {/* Player inline (para ver video terminado) */}
            {playerVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-xl card p-6 animate-slide-up">
                        <h2 className="font-bold text-slate-100 mb-4 truncate">{playerVideo.tema}</h2>
                        <VideoPlayer videoUrl={playerVideo.videoUrl} onClose={() => setPlayerVideo(null)} />
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-2xl border animate-slide-up
          ${toast.tipo === 'error'
                        ? 'bg-red-900/90 border-red-500/30 text-red-200'
                        : 'bg-neon-green/10 border-neon-green/30 text-green-300'}`}>
                    {toast.msg}
                </div>
            )}
        </div>
    )
}
