'use strict';

const { ok, clientError, serverError, preflight } = require('./shared/response');
const { generarPreview } = require('./previewService');

/**
 * Lambda handler — POST /preview
 *
 * Body: { videoId: string, stability?: number, similarity?: number }
 * Response: { videoId, sampleAudioUrl, vozSettings, estado: 'preview' }
 */
exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return preflight();

    try {
        const body = JSON.parse(event.body || '{}');
        const { videoId, stability = 0.5, similarity = 0.7 } = body;

        if (!videoId) {
            return clientError('Se requiere "videoId".');
        }

        console.log(`[lambda-preview] videoId=${videoId} stability=${stability} similarity=${similarity}`);

        const result = await generarPreview(videoId, Number(stability), Number(similarity));
        return ok(result);

    } catch (err) {
        return serverError(err);
    }
};

