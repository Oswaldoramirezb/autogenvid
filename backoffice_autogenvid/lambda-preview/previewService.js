'use strict';

const axios = require('axios');
const { UpdateCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('./shared/dynamoClient');
const { getPresignedUrl, putObject } = require('./shared/s3Client');

const USE_MOCK = process.env.USE_MOCK === 'true';
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'videos';
const VIDEOS_BUCKET = process.env.S3_VIDEOS_BUCKET || 'videobot-videos-bucket';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// Voz por defecto: Adam (voz masculina en español de ElevenLabs)
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';

// ─── Mock de fondos ──────────────────────────────────────────────────────────
const MOCK_FONDOS_VIDEO = [
    { id: 'v1', thumbUrl: 'https://images.pexels.com/videos/856015/free-video-856015.jpg', fullUrl: 'https://player.vimeo.com/external/291648067.sd.mp4?s=7f9ee1f8ec1e5376027f4a6d1d05d851b8be9300&profile_id=165', keyword: 'tecnologia', tipo: 'video' },
    { id: 'v2', thumbUrl: 'https://images.pexels.com/videos/3194277/free-video-3194277.jpg', fullUrl: 'https://player.vimeo.com/external/371913064.sd.mp4', keyword: 'ciudad nocturna', tipo: 'video' },
    { id: 'v3', thumbUrl: 'https://images.pexels.com/videos/3722055/free-video-3722055.jpg', fullUrl: 'https://player.vimeo.com/external/358743048.sd.mp4', keyword: 'naturaleza', tipo: 'video' },
    { id: 'v4', thumbUrl: 'https://images.pexels.com/videos/2800567/free-video-2800567.jpg', fullUrl: 'https://player.vimeo.com/external/328940985.sd.mp4', keyword: 'espacio', tipo: 'video' },
    { id: 'v5', thumbUrl: 'https://images.pexels.com/videos/1568454/free-video-1568454.jpg', fullUrl: 'https://player.vimeo.com/external/306440818.sd.mp4', keyword: 'data', tipo: 'video' },
    { id: 'v6', thumbUrl: 'https://images.pexels.com/videos/3129957/free-video-3129957.jpg', fullUrl: 'https://player.vimeo.com/external/362024379.sd.mp4', keyword: 'futurismo', tipo: 'video' },
];

const MOCK_FONDOS_FOTO = [
    { id: 'f1', thumbUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=300', fullUrl: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg', keyword: 'tecnologia', tipo: 'foto' },
    { id: 'f2', thumbUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?w=300', fullUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg', keyword: 'programacion', tipo: 'foto' },
    { id: 'f3', thumbUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?w=300', fullUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg', keyword: 'ciudad', tipo: 'foto' },
    { id: 'f4', thumbUrl: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?w=300', fullUrl: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg', keyword: 'abstracto', tipo: 'foto' },
    { id: 'f5', thumbUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?w=300', fullUrl: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg', keyword: 'espacio', tipo: 'foto' },
    { id: 'f6', thumbUrl: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?w=300', fullUrl: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg', keyword: 'datos', tipo: 'foto' },
];

// URL de audio de muestra para mock (voz sintética pública)
const MOCK_AUDIO_URL = 'https://www2.cs.uic.edu/~i101/SoundFiles/preamble10.wav';

/**
 * Llama a ElevenLabs para generar audio real a partir del guion.
 */
async function generarAudioElevenLabs(texto, stability, similarity) {
    console.log('[lambda-preview] Llamando a ElevenLabs...');
    // Tomamos solo los primeros ~300 chars para el preview de 10 segundos
    const textoPrev = texto.substring(0, 300);

    const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
            text: textoPrev,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability, similarity_boost: similarity },
        },
        {
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg',
            },
            responseType: 'arraybuffer',
            timeout: 25000,
        }
    );

    return Buffer.from(response.data);
}

/**
 * Genera preview de audio y fondos.
 */
async function generarPreview(videoId, modo = 'video', stability = 0.5, similarity = 0.7) {
    const fondos = modo === 'video' ? MOCK_FONDOS_VIDEO : MOCK_FONDOS_FOTO;

    if (USE_MOCK || !ELEVENLABS_API_KEY) {
        console.log('[lambda-preview] Usando mock de audio');
        await new Promise(r => setTimeout(r, 600));

        await docClient.send(new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id: videoId },
            UpdateExpression: 'SET estado = :e, sampleAudio = :a, fondos = :f, vozSettings = :v',
            ExpressionAttributeValues: {
                ':e': 'preview',
                ':a': MOCK_AUDIO_URL,
                ':f': fondos.map(f => f.thumbUrl),
                ':v': { stability, similarity },
            },
        }));

        return { videoId, sampleAudioUrl: MOCK_AUDIO_URL, fondos, vozSettings: { stability, similarity }, estado: 'preview' };
    }

    // ── Integración real con ElevenLabs ──────────────────────────────────────
    // 1. Obtener el guion del video desde DynamoDB
    const queryResult = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': videoId },
        Limit: 1,
    }));

    const video = queryResult.Items && queryResult.Items[0];
    if (!video || !video.guion) throw new Error(`Video ${videoId} no tiene guion`);

    // 2. Generar audio con ElevenLabs
    const audioBuffer = await generarAudioElevenLabs(video.guion, stability, similarity);

    // 3. Subir audio a S3
    const audioKey = `previews/${videoId}/sample.mp3`;
    await putObject(VIDEOS_BUCKET, audioKey, audioBuffer, 'audio/mpeg');

    // 4. Generar URL prefirmada para el audio (válida 1 hora)
    const sampleAudioUrl = await getPresignedUrl(VIDEOS_BUCKET, audioKey, 3600);

    // 5. Actualizar DynamoDB
    await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: videoId },
        UpdateExpression: 'SET estado = :e, sampleAudio = :a, fondos = :f, vozSettings = :v',
        ExpressionAttributeValues: {
            ':e': 'preview',
            ':a': sampleAudioUrl,
            ':f': fondos.map(f => f.thumbUrl),
            ':v': { stability, similarity },
        },
    }));

    console.log('[lambda-preview] Audio generado y subido a S3:', audioKey);
    return { videoId, sampleAudioUrl, fondos, vozSettings: { stability, similarity }, estado: 'preview' };
}

/**
 * Busca fondos por keyword (mock).
 */
async function buscarFondos(keyword, modo = 'video') {
    await new Promise(r => setTimeout(r, 300));
    const fondos = modo === 'video' ? MOCK_FONDOS_VIDEO : MOCK_FONDOS_FOTO;
    const kw = keyword.toLowerCase();
    return fondos.filter(f => f.keyword.includes(kw) || kw.includes(f.keyword));
}

module.exports = { generarPreview, buscarFondos };
