'use strict';

const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('./shared/dynamoClient');

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'videos';
const region = process.env.AWS_REGION || 'us-east-1';
const BATCH_LIMIT = 5;

/**
 * Obtiene hasta 5 registros con estado='aprobado' y fechaObjetivo=hoy.
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
 * Ejecuta el batch diario: reporta registros aprobados pendientes.
 * La generación de audio se realiza bajo demanda desde el frontend.
 */
async function ejecutarBatch() {
    const videos = await obtenerVideosAprobados();
    console.log(`[lambda-batch] Aprobados para hoy: ${videos.length}`);
    return { procesados: videos.length, mensaje: 'La generación de audio se realiza bajo demanda.' };
}

module.exports = { ejecutarBatch, obtenerVideosAprobados };
