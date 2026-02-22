'use strict';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
};

/**
 * Respuesta exitosa (200)
 */
function ok(data) {
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        body: JSON.stringify({ success: true, data }),
    };
}

/**
 * Error de cliente (4xx)
 */
function clientError(message, statusCode = 400) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        body: JSON.stringify({ success: false, error: message }),
    };
}

/**
 * Error de servidor (5xx)
 */
function serverError(err) {
    console.error('[Lambda Error]', err);
    return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        body: JSON.stringify({ success: false, error: 'Error interno del servidor' }),
    };
}

/**
 * Respuesta OPTIONS (preflight CORS)
 */
function preflight() {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
}

module.exports = { ok, clientError, serverError, preflight };
