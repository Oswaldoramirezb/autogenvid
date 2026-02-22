'use strict';

const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../shared/dynamoClient');

const USE_MOCK = process.env.USE_MOCK === 'true' || true;
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'videos';
const VIDEOS_BUCKET = process.env.S3_VIDEOS_BUCKET || 'videobot-videos-bucket';

// URL de video de muestra (MP4 público simulado ~60s)
const MOCK_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

/**
 * Genera el video final (mock ffmpeg) y actualiza DynamoDB.
 * @param {string} videoId
 * @param {string[]} fondos  - URLs de fondos seleccionados
 * @param {number}   stability
 */
async function generarVideo(videoId, fondos, stability) {
    // Actualizar estado a "generando"
    await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: videoId },
        UpdateExpression: 'SET estado = :e',
        ExpressionAttributeValues: { ':e': 'generando' },
    }));

    if (USE_MOCK) {
        // Simular tiempo de procesamiento ffmpeg
        await new Promise(r => setTimeout(r, 2000));

        const s3VideoKey = `videos/${videoId}/final.mp4`;
        const videoUrl = `https://${VIDEOS_BUCKET}.s3.amazonaws.com/${s3VideoKey}`;

        // Actualizar DynamoDB con URL final y estado "listo"
        await docClient.send(new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id: videoId },
            UpdateExpression: 'SET estado = :e, videoUrl = :v, fondos = :f',
            ExpressionAttributeValues: {
                ':e': 'listo',
                ':v': MOCK_VIDEO_URL,   // En producción sería la URL de S3
                ':f': fondos,
            },
        }));

        return { videoId, videoUrl: MOCK_VIDEO_URL, estado: 'listo', s3Key: s3VideoKey };
    }

    // ── Integración real ffmpeg en Lambda Layer (activar cuando USE_MOCK=false) ──
    // const { execSync } = require('child_process');
    // const path = require('path');
    // const outputPath = `/tmp/${videoId}.mp4`;
    // execSync(`ffmpeg -i ${fondos[0]} -vf "...overlay..." -t 60 ${outputPath}`);
    // await putObject(VIDEOS_BUCKET, s3VideoKey, fs.readFileSync(outputPath), 'video/mp4');
    throw new Error('USE_MOCK debe ser true mientras no se configure ffmpeg layer');
}

module.exports = { generarVideo };
