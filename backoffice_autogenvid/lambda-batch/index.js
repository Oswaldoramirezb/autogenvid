'use strict';

const { ejecutarBatch } = require('./batchService');

/**
 * Lambda handler — EventBridge cron diario a las 8AM
 * No retorna respuesta HTTP, solo log de resultados.
 */
exports.handler = async (event) => {
    console.log('[lambda-batch] Iniciando batch diario de videos...', JSON.stringify(event));
    try {
        const resultado = await ejecutarBatch();
        console.log('[lambda-batch] Batch completado:', JSON.stringify(resultado));
        return resultado;
    } catch (err) {
        console.error('[lambda-batch] Error en batch diario:', err);
        throw err; // re-lanzar para que EventBridge reintente
    }
};
