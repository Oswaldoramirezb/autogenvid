/**
 * Capa de servicio API — wrapper sobre API Gateway.
 * Cuando VITE_USE_MOCK=true, retorna datos mock sin conexión real.
 */
import {
    MOCK_VIDEOS,
    MOCK_AUDIO_URL,
} from './mocks'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_URL = import.meta.env.VITE_API_GATEWAY_URL || ''

// ─── Helper fetch ─────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
    const { fetchAuthSession } = await import('aws-amplify/auth')
    const session = await fetchAuthSession()
    const token = session.tokens?.idToken?.toString()

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error || `HTTP ${res.status}`)
    }

    const data = await res.json()
    return data.data ?? data
}

// ─── Simulated state ─────────────────────────────────────────────────────────
let _videosStore = [...MOCK_VIDEOS]

function delay(ms = 400) {
    return new Promise(r => setTimeout(r, ms))
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /videos — Lista todos los videos */
export async function listarVideos() {
    if (USE_MOCK) {
        await delay(600)
        return [..._videosStore]
    }
    return apiFetch('/videos')
}

/** POST /guion — Genera guion para un tema */
export async function generarGuion(tema, customPrompt) {
    if (USE_MOCK) {
        await delay(1200)
        const nuevoVideo = {
            ..._videosStore[0],
            id: `mock-video-${Date.now()}`,
            tema,
            estado: 'pendiente',
            videoUrl: null,
            sampleAudio: null,
            createdAt: Math.floor(Date.now() / 1000),
        }
        _videosStore = [nuevoVideo, ..._videosStore]
        return nuevoVideo
    }
    return apiFetch('/guion', { method: 'POST', body: JSON.stringify({ tema, customPrompt }) })
}

/** POST /preview — Genera audio del guion */
export async function generarPreview(videoId, stability, similarity, isSample = false) {
    if (USE_MOCK) {
        await delay(800)
        _videosStore = _videosStore.map(v =>
            v.id === videoId
                ? { ...v, estado: 'preview', sampleAudio: MOCK_AUDIO_URL, vozSettings: { stability, similarity } }
                : v
        )
        return { videoId, sampleAudioUrl: MOCK_AUDIO_URL, vozSettings: { stability, similarity }, estado: 'preview' }
    }
    return apiFetch('/preview', {
        method: 'POST',
        body: JSON.stringify({ videoId, stability, similarity, isSample })
    })
}

/** PATCH /guion — Guarda el guion editado en DynamoDB */
export async function guardarGuion(videoId, guion) {
    if (USE_MOCK) {
        await delay(300)
        _videosStore = _videosStore.map(v => v.id === videoId ? { ...v, guion } : v)
        return { id: videoId, guion, updated: true }
    }
    return apiFetch(`/guion/${videoId}`, { method: 'PATCH', body: JSON.stringify({ guion }) })
}

/** POST /guion — Regenera guion con customPrompt para un video existente */
export async function regenerarGuion(videoId, tema, customPrompt) {
    if (USE_MOCK) {
        await delay(1200)
        return { guion: `[Mock regenerado] ${customPrompt.substring(0, 80)}...` }
    }
    return apiFetch('/guion', { method: 'POST', body: JSON.stringify({ tema, customPrompt, videoId }) })
}

/** PATCH /videos/:id — Actualiza estado (ej: aprobar) */
export async function actualizarVideo(videoId, cambios) {
    if (USE_MOCK) {
        await delay(300)
        _videosStore = _videosStore.map(v => v.id === videoId ? { ...v, ...cambios } : v)
        return _videosStore.find(v => v.id === videoId)
    }
    return apiFetch(`/videos/${videoId}`, { method: 'PATCH', body: JSON.stringify(cambios) })
}

/** DELETE /videos/:id — Elimina un video */
export async function eliminarVideo(videoId) {
    if (USE_MOCK) {
        await delay(300)
        _videosStore = _videosStore.filter(v => v.id !== videoId)
        return { deleted: true }
    }
    return apiFetch(`/videos/${videoId}`, { method: 'DELETE' })
}
