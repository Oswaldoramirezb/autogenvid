'use strict';

const { ok, clientError, serverError, preflight } = require('./shared/response');
const { generarVideo } = require('./videoService');

/**
 * Lambda handler — POST /video
 * Puede ser invocado directamente (API Gateway) o por lambda-batch (InvokeCommand).
 *
 * Body: { videoId: string, fondos: string[], stability?: number }
 */
exports.handler = async (event) => {
    // Soporte invocación directa (no HTTP) desde lambda-batch
    const isDirectInvoke = !event.httpMethod;
    if (!isDirectInvoke && event.httpMethod === 'OPTIONS') return preflight();

    try {
        const body = isDirectInvoke ? event : JSON.parse(event.body || '{}');
        const { videoId, fondos = [], stability = 0.5 } = body;

        if (!videoId) {
            const msg = 'El campo "videoId" es requerido.';
            return isDirectInvoke ? { error: msg } : clientError(msg);
        }

        console.log(`[lambda-video] Generando video para videoId=${videoId}`);
        const result = await generarVideo(videoId, fondos, Number(stability));

        return isDirectInvoke ? result : ok(result);

    } catch (err) {
        return isDirectInvoke ? { error: err.message } : serverError(err);
    }
};
