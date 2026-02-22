export default function VideoPlayer({ videoUrl, onClose }) {
    function handleDescargar() {
        const a = document.createElement('a')
        a.href = videoUrl
        a.download = 'videobot-ai-video.mp4'
        a.target = '_blank'
        a.click()
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                🎬 Video Generado
            </h3>

            <div className="relative rounded-2xl overflow-hidden shadow-xl ring-2 ring-neon-blue/50 glow-blue bg-black">
                <video
                    id="video-player-main"
                    src={videoUrl}
                    controls
                    className="w-full max-h-72 object-contain"
                    autoPlay={false}
                >
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>

            <div className="flex gap-3">
                <button
                    id="btn-descargar-video"
                    onClick={handleDescargar}
                    className="btn-success flex-1 py-3 flex items-center justify-center gap-2 rounded-xl"
                >
                    ⬇️ Descargar MP4
                </button>
                <button
                    id="btn-cerrar-player"
                    onClick={onClose}
                    className="btn-secondary px-4 py-3 rounded-xl"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}
