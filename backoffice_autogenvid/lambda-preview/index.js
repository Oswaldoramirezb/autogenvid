'use strict';

const { ok, clientError, serverError, preflight } = require('../shared/response');
const { generarPreview, buscarFondos } = require('./previewService');

/**
 * Lambda handler — POST /preview
 *
 * Body: { videoId: string, modo: 'video'|'foto', stability?: number, similarity?: number, busqueda?: string }
 * Response: { videoId, sampleAudioUrl, fondos[], vozSettings, estado }
 */
exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return preflight();

    try {
        const body = JSON.parse(event.body || '{}');
        const { videoId, modo = 'video', stability = 0.5, similarity = 0.7, busqueda } = body;

        if (!videoId) {
            return clientError('El campo "videoId" es requerido.');
        }

        console.log(`[lambda-preview] videoId=${videoId} modo=${modo} stability=${stability} similarity=${similarity}`);

        // Si viene búsqueda, retornar solo fondos filtrados
        if (busqueda) {
            const fondos = await buscarFondos(busqueda, modo);
            return ok({ fondos });
        }

        const result = await generarPreview(videoId, modo, Number(stability), Number(similarity));
        return ok(result);

    } catch (err) {
        return serverError(err);
    }
};
