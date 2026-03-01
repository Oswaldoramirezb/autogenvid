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

export const MOCK_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
