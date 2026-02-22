'use strict';

const { handler } = require('../index');

// Mock de módulos AWS
jest.mock('../../shared/dynamoClient', () => ({
    docClient: { send: jest.fn().mockResolvedValue({}) },
}));

describe('lambda-guion handler', () => {
    test('responde 400 si falta el tema', async () => {
        const event = { httpMethod: 'POST', body: JSON.stringify({}) };
        const res = await handler(event);
        expect(res.statusCode).toBe(400);
        const body = JSON.parse(res.body);
        expect(body.success).toBe(false);
    });

    test('responde 200 con guion mockeado para tema válido', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ tema: 'Inteligencia Artificial 2026' }),
        };
        const res = await handler(event);
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.success).toBe(true);
        expect(body.data).toHaveProperty('id');
        expect(body.data).toHaveProperty('guion');
        expect(body.data.fuentes).toHaveLength(10);
        expect(body.data.estado).toBe('pendiente');
    });

    test('responde 204 al preflight OPTIONS', async () => {
        const event = { httpMethod: 'OPTIONS' };
        const res = await handler(event);
        expect(res.statusCode).toBe(204);
    });
});
