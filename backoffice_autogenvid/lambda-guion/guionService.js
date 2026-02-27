'use strict';

const { v4: uuidv4 } = require('uuid');
const { docClient } = require('./shared/dynamoClient');
const { PutCommand, ScanCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const USE_MOCK = process.env.USE_MOCK === 'true' || true;
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'videos';

// ─── Mock de respuesta (simula Gemini API) ───────────────────────────────────
const MOCK_GUION = {
    guion: `¡Sabías que la Inteligencia Artificial en 2026 ya supera a los humanos en más de 50 tareas cognitivas? 🤖

En los últimos 12 meses, modelos como GPT-5 y Gemini Ultra 2 han logrado:
• Diagnosticar enfermedades raras con 97% de precisión
• Componer sinfonías completas indistinguibles de Beethoven
• Resolver ecuaciones matemáticas que tardaron décadas en resolverse

Pero aquí viene lo más impactante: el 73% de las empresas Fortune 500 ya automatizaron áreas completas con IA...

¿Qué significa esto para ti? Los trabajos del futuro no serán reemplazados por la IA, sino por personas que SABEN usar la IA. 

Síguenos para aprender a surfear esta ola tecnológica antes de que te arrastre. 🌊`,

    fuentes: [
        'https://arxiv.org/abs/2401.00001',
        'https://openai.com/research/gpt-5',
        'https://deepmind.google/research/',
        'https://www.nature.com/articles/ai-2026',
        'https://mit.edu/news/ai-cognitive-tasks-2026',
        'https://stanford.edu/hai/report-2026',
        'https://fortune.com/500-ai-automation',
        'https://ieee.org/ai-standards-2026',
        'https://bloomberg.com/tech/ai-economy',
        'https://wired.com/story/ai-2026-review',
    ],

    postRedes: {
        twitter: '🤖 La IA ya supera a humanos en 50 tareas cognitivas. ¿Estás preparado? #IA #FuturoDigital #TechTrends',
        instagram: '¿Sabías que el 73% de Fortune 500 ya usa IA masivamente? 🚀 Aprende a usarla antes de que sea tarde. Link en bio 👆',
        tiktok: '¡La IA en 2026 es INCREÍBLE! Te cuento los 5 avances más impactantes del año 🔥 #IA #2026 #TechTok',
        linkedin: 'Análisis: Los 10 hitos más importantes de la IA en 2026 y su impacto en el mercado laboral. Artículo completo →',
    },
};

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Genera un guion usando Gemini AI.
 */
async function generarGuion(tema, customPrompt) {
    if (USE_MOCK && !process.env.GEMINI_API_KEY) {
        console.log('[MOCK] Generando guion de prueba');
        await new Promise(r => setTimeout(r, 800));
        return {
            ...MOCK_GUION,
            guion: MOCK_GUION.guion.replace('Inteligencia Artificial en 2026', tema),
        };
    }

    console.log(`[lambda-guion] Usando API Key: ${process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 4) + '...' : 'VACÍA'}`);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const systemInstruction = `Eres un experto documentalista y creador de contenido de ALTO NIVEL para YouTube y TikTok, especializado en CULTURA GENERAL, HISTORIA y CIENCIA. 
Tus guiones deben ser profundos, con datos poco conocidos y una narrativa apasionante.

DURACIÓN: El guion debe durar exactamente 90 SEGUNDOS (aproximadamente 300 a 350 palabras). No seas breve, profundiza en los detalles.
FUENTES PROHIBIDAS: Queda estrictamente PROHIBIDO usar Wikipedia.
FUENTES PERMITIDAS: Utiliza únicamente fuentes de prestigio como National Geographic, History Channel, Britannica, Nature, revistas científicas o archivos históricos oficiales. Debes incluir al menos 5 enlaces directos.

ESTRUCTURA DE RESPUESTA: Responde ÚNICAMENTE con un JSON puro (sin bloques de código markdown):
{
  "guion": "Texto detallado de 90 segundos con emojis y pausas narrativas...",
  "fuentes": ["url_prestigio1", "url_prestigio2", "url_prestigio3", "url_prestigio4", "url_prestigio5"],
  "postRedes": {
    "twitter": "Post viral",
    "instagram": "Caption educativa",
    "tiktok": "Script de enganche",
    "linkedin": "Análisis profesional"
  }
}`;

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemInstruction
    });

    const userPrompt = customPrompt || `Genera un documental detallado de 90 segundos sobre: ${tema}. Recuerda: Datos profundos, nada de Wikipedia y fuentes de prestigio.`;

    try {
        const result = await model.generateContent(userPrompt);
        const text = result.response.text();
        const cleanContent = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanContent);
    } catch (e) {
        console.error('[lambda-guion] Error con Gemini:', e);

        const isQuotaError = e.status === 429 || (e.message && e.message.includes('429')) || (e.errorDetails && JSON.stringify(e.errorDetails).includes('429'));

        if (isQuotaError) {
            throw new Error('Lo sentimos, pero se ha alcanzado el límite de peticiones gratuitas de Google por este minuto. Por favor, espera 30-60 segundos y vuelve a intentarlo. Tu guion profesional estará listo pronto.');
        }

        throw new Error('No pudimos conectar con el experto en guiones en este momento. Reintenta en unos segundos.');
    }
}

/**
 * Persiste el video nuevo en DynamoDB con estado 'pendiente'.
 */
async function crearVideoEnDB(tema, guionData) {
    const item = {
        id: uuidv4(),
        tema,
        guion: guionData.guion,
        fuentes: guionData.fuentes,
        estado: 'pendiente',
        fechaObjetivo: new Date(Date.now() + 86400000).toISOString().split('T')[0], // mañana
        vozSettings: { stability: 0.5, similarity: 0.7 },
        fondos: [],
        sampleAudio: null,
        videoUrl: null,
        postRedes: guionData.postRedes,
        createdAt: Math.floor(Date.now() / 1000),
    };

    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    return item;
}

/**
 * Lista todos los videos de la base de datos.
 */
async function listarVideos() {
    const result = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME
    }));
    // Devolvemos los items ordenados por fecha de creación (más recientes primero)
    return (result.Items || []).sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Elimina un video de la base de datos por su ID.
 */
async function eliminarVideo(id) {
    await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id }
    }));
    return { id, eliminado: true };
}

module.exports = { generarGuion, crearVideoEnDB, listarVideos, eliminarVideo };
