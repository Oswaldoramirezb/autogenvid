'use strict';

const { handler } = require('../index');

// Mock del batchService
jest.mock('../batchService', () => ({
    ejecutarBatch: jest.fn().mockResolvedValue({ procesados: 3, exitosos: 3, fallidos: 0 }),
}));

describe('lambda-batch handler', () => {
    test('ejecuta batch y retorna resultado', async () => {
        const event = { source: 'aws.events', 'detail-type': 'Scheduled Event' };
        const res = await handler(event);
        expect(res.procesados).toBe(3);
        expect(res.exitosos).toBe(3);
        expect(res.fallidos).toBe(0);
    });
});
