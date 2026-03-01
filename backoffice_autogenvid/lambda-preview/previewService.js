'use strict';

const axios = require('axios');
const { UpdateCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('./shared/dynamoClient');
const { getPresignedUrl, putObject } = require('./shared/s3Client');

const USE_MOCK = process.env.USE_MOCK === 'true';
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'videos';
const AUDIOS_BUCKET = process.env.S3_VIDEOS_BUCKET || 'videobot-videos-bucket';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'qRUgOhnxGASxirG4fKjv';
const E11_MODEL_ID = process.env.E11_MODEL_ID || 'eleven_turbo_v2_5';

// URL de audio mock (fallback cuando no hay API key)
const MOCK_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

/**
 * Llama a ElevenLabs y genera el MP3 del guion completo.
 * Retorna un Buffer con el audio.
 */
async function generarAudioElevenLabs(texto, stability, similarity) {
    console.log('[lambda-preview] Llamando a ElevenLabs, chars:', texto.length);
    const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
            text: texto,
            model_id: E11_MODEL_ID,
            voice_settings: { stability, similarity_boost: similarity },
        },
        {
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg',
            },
            responseType: 'arraybuffer',
            timeout: 90000,
        }
    );
    return Buffer.from(response.data);
}

/**
 * Genera el audio del guion y retorna una URL de descarga.
 *
 * Flujo:
 *   1. Leer guion desde DynamoDB
 *   2. Generar MP3 completo con ElevenLabs
 *   3. Subir a S3: previews/{YYYY-MM-DD}/{videoId}/audio.mp3
 *   4. Retornar URL prefirmada de descarga (7 dias)
 *   5. Actualizar DynamoDB: estado='preview', sampleAudio, vozSettings
 */
async function generarPreview(videoId, stability = 0.5, similarity = 0.7) {
    // Fecha del dia para organizar archivos en S3 por fecha
    const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // MODO MOCK
    if (USE_MOCK || !ELEVENLABS_API_KEY) {
        console.log('[lambda-preview] Modo mock - usando audio de muestra');
        await new Promise(r => setTimeout(r, 600));

        await docClient.send(new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id: videoId },
            UpdateExpression: 'SET estado = :e, sampleAudio = :a, vozSettings = :v',
            ExpressionAttributeValues: {
                ':e': 'preview',
                ':a': MOCK_AUDIO_URL,
                ':v': { stability, similarity },
            },
        }));

        return { videoId, sampleAudioUrl: MOCK_AUDIO_URL, vozSettings: { stability, similarity }, estado: 'preview' };
    }

    // MODO REAL
    // 1. Obtener guion del video
    const queryResult = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': videoId },
        Limit: 1,
    }));

    const video = queryResult.Items && queryResult.Items[0];
    if (!video || !video.guion) throw new Error(`El video ${videoId} no tiene guion`);

    // 2. Generar MP3 con ElevenLabs
    const audioBuffer = await generarAudioElevenLabs(video.guion, stability, similarity);

    // 3. Subir a S3 — ruta: previews/{YYYY-MM-DD}/{videoId}/audio.mp3
    const audioKey = `previews/${fechaHoy}/${videoId}/audio.mp3`;
    await putObject(AUDIOS_BUCKET, audioKey, audioBuffer, 'audio/mpeg');
    console.log('[lambda-preview] Audio subido a S3:', audioKey);

    // 4. URL prefirmada de descarga (valida 7 dias)
    const sampleAudioUrl = await getPresignedUrl(AUDIOS_BUCKET, audioKey, 604800);

    // 5. Actualizar DynamoDB
    await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: videoId },
        UpdateExpression: 'SET estado = :e, sampleAudio = :a, audioKey = :k, vozSettings = :v',
        ExpressionAttributeValues: {
            ':e': 'preview',
            ':a': sampleAudioUrl,
            ':k': audioKey,
            ':v': { stability, similarity },
        },
    }));

    return { videoId, sampleAudioUrl, audioKey, vozSettings: { stability, similarity }, estado: 'preview' };
}

module.exports = { generarPreview };
