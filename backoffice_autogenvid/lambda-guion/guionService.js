'use strict';

const { v4: uuidv4 } = require('uuid');
const { docClient } = require('../shared/dynamoClient');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

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

/**
 * Genera un guion usando Gemini AI (o mock).
 * @param {string} tema
 * @param {string} [customPrompt]
 */
async function generarGuion(tema, customPrompt) {
    if (USE_MOCK) {
        // Simular latencia de API real
        await new Promise(r => setTimeout(r, 800));
        return {
            ...MOCK_GUION,
            guion: MOCK_GUION.guion.replace('Inteligencia Artificial en 2026', tema),
        };
    }

    // ── Integración real con Gemini (activar cuando USE_MOCK=false) ──
    // const { GoogleGenerativeAI } = require('@google/generative-ai');
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    // const prompt = customPrompt || `Genera un guion viral de 60 segundos sobre: ${tema}...`;
    // const result = await model.generateContent(prompt);
    // return JSON.parse(result.response.text());

    throw new Error('USE_MOCK debe ser true mientras no se configure GEMINI_API_KEY');
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

module.exports = { generarGuion, crearVideoEnDB };
