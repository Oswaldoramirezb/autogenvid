'use strict';

const { ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const { docClient } = require('../shared/dynamoClient');

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'videos';
const LAMBDA_VIDEO_FN = process.env.LAMBDA_VIDEO_FUNCTION_NAME || 'videobot-lambda-video';
const region = process.env.AWS_REGION || 'us-east-1';
const BATCH_LIMIT = 5;

const lambdaClient = new LambdaClient({ region });

/**
 * Obtiene hasta 5 videos con estado='aprobado' y fechaObjetivo=hoy.
 */
async function obtenerVideosAprobados() {
    const hoy = new Date().toISOString().split('T')[0];

    // En producción usar un GSI sobre (estado, fechaObjetivo) para eficiencia
    const res = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'estado = :e AND fechaObjetivo = :f',
        ExpressionAttributeValues: { ':e': 'aprobado', ':f': hoy },
        Limit: 100, // escanear y filtrar en memoria
    }));

    // Retornar solo BATCH_LIMIT
    return (res.Items || []).slice(0, BATCH_LIMIT);
}

/**
 * Invoca lambda-video para un videoId dado.
 */
async function invocarLambdaVideo(video) {
    const payload = {
        videoId: video.id,
        fondos: video.fondos || [],
        stability: video.vozSettings?.stability || 0.5,
    };

    // Actualizar estado a "generando" antes de invocar
    await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: video.id },
        UpdateExpression: 'SET estado = :e',
        ExpressionAttributeValues: { ':e': 'generando' },
    }));

    const command = new InvokeCommand({
        FunctionName: LAMBDA_VIDEO_FN,
        InvocationType: 'Event', // async — no esperar respuesta
        Payload: Buffer.from(JSON.stringify(payload)),
    });

    return lambdaClient.send(command);
}

/**
 * Ejecuta el batch diario: obtiene aprobados → invoca lambda-video.
 */
async function ejecutarBatch() {
    const videos = await obtenerVideosAprobados();
    console.log(`[lambda-batch] Videos aprobados para hoy: ${videos.length}`);

    if (videos.length === 0) {
        return { procesados: 0, mensaje: 'No hay videos aprobados para hoy.' };
    }

    const resultados = await Promise.allSettled(videos.map(invocarLambdaVideo));

    const exitosos = resultados.filter(r => r.status === 'fulfilled').length;
    const fallidos = resultados.filter(r => r.status === 'rejected').length;

    console.log(`[lambda-batch] Exitosos: ${exitosos} | Fallidos: ${fallidos}`);
    return { procesados: videos.length, exitosos, fallidos };
}

module.exports = { ejecutarBatch, obtenerVideosAprobados };
