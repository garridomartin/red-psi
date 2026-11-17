// lib/utils/dates.test.ts
import { Config } from 'jest';
import { formatDateAR, todayISO } from './dates';

describe('formatDateAR', () => {
    it('formatea ISO corto', () => expect(formatDateAR('2024-03-15')).toBe('15/03/2024'));
    it('formatea ISO con hora', () =>
        expect(formatDateAR('2024-03-15T10:00:00Z')).toBe('15/03/2024'));
    it('devuelve fallback con null', () => expect(formatDateAR(null)).toBe('—'));
    it('devuelve fallback con undefined', () => expect(formatDateAR(undefined)).toBe('—'));
    it('acepta fallback custom', () => expect(formatDateAR(null, '')).toBe(''));
});

describe('todayISO', () => {
    it('devuelve YYYY-MM-DD', () => expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/));
});

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1', // Ajusta esto si tu baseUrl es distinta
    },
};
