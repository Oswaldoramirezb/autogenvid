'use strict';

const { handler } = require('../index');

jest.mock('../../shared/dynamoClient', () => ({
    docClient: { send: jest.fn().mockResolvedValue({}) },
}));

describe('lambda-video handler', () => {
    test('responde con error si falta videoId (API Gateway)', async () => {
        const event = { httpMethod: 'POST', body: JSON.stringify({ fondos: [] }) };
        const res = await handler(event);
        expect(res.statusCode).toBe(400);
    });

    test('responde 200 con URL de video mock (API Gateway)', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify({ videoId: 'uuid-test-456', fondos: ['thumb1.jpg'], stability: 0.5 }),
        };
        const res = await handler(event);
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.data.estado).toBe('listo');
        expect(body.data.videoUrl).toBeTruthy();
    });

    test('invocación directa retorna objeto con videoUrl', async () => {
        const event = { videoId: 'uuid-batch-789', fondos: ['thumb1.jpg'] };
        const res = await handler(event);
        expect(res.videoUrl).toBeTruthy();
        expect(res.estado).toBe('listo');
    });
});
