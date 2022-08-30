import dotenv from 'dotenv';

import { encode, decode } from '../src/core';

beforeAll(async () => {
    dotenv.config();
});

describe('Core functions', () => {
    it('Encodes and decodes correctly', async () => {
        const someString = 'test string';

        const encoded = encode(someString);
        const decoded = decode(encoded);

        expect(decoded).toBe(someString);
    });
});
