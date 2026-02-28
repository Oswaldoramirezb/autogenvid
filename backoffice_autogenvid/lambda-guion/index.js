'use strict';

const { ok, clientError, serverError, preflight } = require('./shared/response');
const { generarGuion, crearVideoEnDB, listarVideos, eliminarVideo, actualizarGuion } = require('./guionService');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return preflight();

    try {
        // Lógica para Listar Videos (GET /videos)
        if (event.httpMethod === 'GET') {
            const videos = await listarVideos();
            return ok(videos);
        }

        // Lógica para Eliminar Video (DELETE /videos/{id})
        if (event.httpMethod === 'DELETE') {
            const id = event.pathParameters ? event.pathParameters.id : null;
            if (!id) return clientError('El ID del video es necesario para eliminar.');

            const res = await eliminarVideo(id);
            return ok(res);
        }

        // Lógica para Actualizar Guion (PATCH /videos/{id})
        if (event.httpMethod === 'PATCH') {
            const id = event.pathParameters ? event.pathParameters.id : null;
            if (!id) return clientError('El ID del video es necesario.');
            const body = JSON.parse(event.body || '{}');
            if (!body.guion || body.guion.trim().length < 10) return clientError('El campo "guion" es requerido.');
            const res = await actualizarGuion(id, body.guion.trim());
            return ok(res);
        }

        // Lógica para Crear Guion (POST /guion)
        const body = JSON.parse(event.body || '{}');
        const { tema, customPrompt } = body;

        if (!tema || tema.trim().length < 3) {
            return clientError('El campo "tema" es requerido.');
        }

        const guionData = await generarGuion(tema.trim(), customPrompt);
        const videoItem = await crearVideoEnDB(tema.trim(), guionData);

        return ok(videoItem);

    } catch (err) {
        console.error('[lambda-guion] Error:', err);
        return serverError(err);
    }
};
