'use strict';

const { handler } = require('../index');

jest.mock('../../shared/dynamoClient', () => ({
    docClient: { send: jest.fn().mockResolvedValue({}) },
}));

describe('lambda-preview handler', () => {
    test('responde 400 si falta videoId', async () => {
        const event = { httpMethod: 'POST', body: JSON.stringify({ modo: 'video' }) };
        const res = await handler(event);
        expect(res.statusCode).toBe(400);
    });

    test('responde 200 con fondos de video por defecto', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ videoId: 'test-uuid-123', modo: 'video', stability: 0.5, similarity: 0.7 }),
        };
        const res = await handler(event);
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.data.fondos).toHaveLength(6);
        expect(body.data.sampleAudioUrl).toBeTruthy();
    });

    test('responde 200 con fondos de foto en modo foto', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ videoId: 'test-uuid-123', modo: 'foto' }),
        };
        const res = await handler(event);
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.data.fondos[0].tipo).toBe('foto');
    });

    test('busca fondos por keyword', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ videoId: 'test-uuid-123', modo: 'video', busqueda: 'espacio' }),
        };
        const res = await handler(event);
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(Array.isArray(body.data.fondos)).toBe(true);
    });
});
