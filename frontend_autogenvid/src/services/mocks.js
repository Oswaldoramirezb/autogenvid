/**
 * Datos mock para el frontend — simula respuestas de API Gateway.
 * Se usan cuando VITE_USE_MOCK=true.
 */

// ─── Videos mock (35 items) ──────────────────────────────────────────────────
const TEMAS = [
    'Inteligencia Artificial 2026', 'Criptomonedas y DeFi', 'Cambio Climático Soluciones',
    'Neurociencia y Productividad', 'Startups que Cambiaron el Mundo', 'Física Cuántica Explicada',
    'Longevidad y Biohacking', 'El Metaverso en 2026', 'Energía Solar Avanzada',
    'Robots en el Hogar', 'Psicología del Éxito', 'Exploración Espacial 2026',
    'Blockchain más allá de Crypto', 'Medicina Personalizada IA', 'Educación del Futuro',
    'Alimentación y Microbioma', 'Fintech Revolución', 'Genómica y CRISPR',
    'Web3 y Tokens', 'Ciudades Inteligentes', 'Automatización del Trabajo',
    'Meditación y Neuroplasticidad', 'Economía Circular', 'Computación Cuántica',
    'Realidad Aumentada Empresas', 'Seguridad Cibernética 2026', 'Hidrógeno Verde',
    'Cultura del Lado B', 'Derechos Digitales', 'Viajes Espaciales Privados',
    'Programación con IA', 'Salud Mental Digital', 'NFTs y Arte Digital',
    'Lenguas que se Extinguen', 'El Futuro del Dinero',
]

const ESTADOS = ['pendiente', 'preview', 'aprobado', 'generando', 'listo', 'error']

function estadoAleatorio(i) {
    if (i < 5) return 'listo'
    if (i < 10) return 'aprobado'
    if (i < 15) return 'preview'
    if (i < 18) return 'error'
    return 'pendiente'
}

export const MOCK_VIDEOS = TEMAS.map((tema, i) => ({
    id: `mock-video-${String(i + 1).padStart(3, '0')}`,
    tema,
    guion: `¡Sabías que ${tema} está cambiando el mundo en 2026? En este video te contamos los 5 datos más impactantes que nadie te dice. Hook poderoso, datos verificados y un llamado a la acción irresistible. Síguenos para más contenido viral. 🚀`,
    fuentes: [
        'https://arxiv.org/abs/2401.00001',
        'https://nature.com/articles/ejemplo',
        'https://mit.edu/news/ejemplo',
        'https://stanford.edu/news/ejemplo',
        'https://ieee.org/ejemplo',
        'https://wired.com/story/ejemplo',
        'https://bloomberg.com/tech/ejemplo',
        'https://techcrunch.com/ejemplo',
        'https://forbes.com/ejemplo',
        'https://medium.com/ejemplo',
    ],
    estado: estadoAleatorio(i),
    fechaObjetivo: new Date(Date.now() + (i < 10 ? 0 : 86400000 * Math.ceil(i / 5))).toISOString().split('T')[0],
    vozSettings: { stability: 0.5, similarity: 0.7 },
    fondos: [
        'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=300',
        'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?w=300',
    ],
    sampleAudio: i < 15 ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' : null,
    videoUrl: i < 5 ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' : null,
    postRedes: {
        twitter: `🔥 ${tema} — datos que te volarán la mente #IA #Tecnologia #2026`,
        instagram: `¿Sabías que ${tema} ya está entre nosotros? 🚀 Link en bio`,
        tiktok: `Lo que nadie te cuenta sobre ${tema} 😱 #viral #datos #2026`,
        linkedin: `Análisis profundo: ${tema} y su impacto en el mundo empresarial →`,
    },
    createdAt: Math.floor(Date.now() / 1000) - i * 3600,
}))

// ─── Fondos mock ─────────────────────────────────────────────────────────────
export const MOCK_FONDOS_VIDEO = [
    { id: 'v1', thumbUrl: 'https://images.pexels.com/videos/856015/free-video-856015.jpg?h=150', fullUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', keyword: 'tecnología', tipo: 'video' },
    { id: 'v2', thumbUrl: 'https://images.pexels.com/videos/3194277/free-video-3194277.jpg?h=150', fullUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', keyword: 'ciudad nocturna', tipo: 'video' },
    { id: 'v3', thumbUrl: 'https://images.pexels.com/videos/3722055/free-video-3722055.jpg?h=150', fullUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', keyword: 'naturaleza', tipo: 'video' },
    { id: 'v4', thumbUrl: 'https://images.pexels.com/videos/2800567/free-video-2800567.jpg?h=150', fullUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Subaru.mp4', keyword: 'espacio', tipo: 'video' },
    { id: 'v5', thumbUrl: 'https://images.pexels.com/videos/1568454/free-video-1568454.jpg?h=150', fullUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', keyword: 'datos', tipo: 'video' },
    { id: 'v6', thumbUrl: 'https://images.pexels.com/videos/3129957/free-video-3129957.jpg?h=150', fullUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', keyword: 'futurismo', tipo: 'video' },
]

export const MOCK_FONDOS_FOTO = [
    { id: 'f1', thumbUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=300&h=150&fit=crop', fullUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg', keyword: 'tecnología', tipo: 'foto' },
    { id: 'f2', thumbUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?w=300&h=150&fit=crop', fullUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg', keyword: 'programación', tipo: 'foto' },
    { id: 'f3', thumbUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?w=300&h=150&fit=crop', fullUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg', keyword: 'ciudad', tipo: 'foto' },
    { id: 'f4', thumbUrl: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?w=300&h=150&fit=crop', fullUrl: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg', keyword: 'abstracto', tipo: 'foto' },
    { id: 'f5', thumbUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?w=300&h=150&fit=crop', fullUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg', keyword: 'espacio', tipo: 'foto' },
    { id: 'f6', thumbUrl: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?w=300&h=150&fit=crop', fullUrl: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg', keyword: 'datos', tipo: 'foto' },
]

export const MOCK_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
export const MOCK_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
