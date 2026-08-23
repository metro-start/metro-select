import {describe, expect, test} from 'bun:test';

const packageJson = await Bun.file(
    new URL('../package.json', import.meta.url)
).json();

describe('package contract', () => {
    test('publishes the JavaScript and CSS entry points', () => {
        expect(packageJson.version).toBe('3.1.0');
        expect(packageJson.exports['.']).toBe('./metro-select.js');
        expect(packageJson.exports['./metro-select.css']).toBe('./metro-select.css');
        expect(packageJson.files).toContain('metro-select.js');
        expect(packageJson.files).toContain('metro-select.css');
    });
});
