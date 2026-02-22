'use strict';

const { ok, clientError, serverError, preflight } = require('../shared/response');
const { generarGuion, crearVideoEnDB } = require('./guionService');

/**
 * Lambda handler — POST /guion
 *
 * Body: { tema: string, customPrompt?: string }
 * Response: { id, tema, guion, fuentes, postRedes, estado, createdAt }
 */
exports.handler = async (event) => {
    // Preflight CORS
    if (event.httpMethod === 'OPTIONS') return preflight();

    try {
        const body = JSON.parse(event.body || '{}');
        const { tema, customPrompt } = body;

        if (!tema || tema.trim().length < 3) {
            return clientError('El campo "tema" es requerido y debe tener al menos 3 caracteres.');
        }

        console.log(`[lambda-guion] Generando guion para tema: "${tema}"`);

        const guionData = await generarGuion(tema.trim(), customPrompt);
        const videoItem = await crearVideoEnDB(tema.trim(), guionData);

        console.log(`[lambda-guion] Video creado con id: ${videoItem.id}`);
        return ok(videoItem);

    } catch (err) {
        return serverError(err);
    }
};
