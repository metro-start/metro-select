import {beforeEach, describe, expect, test} from 'bun:test';
import {Window} from 'happy-dom';

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLSelectElement = window.HTMLSelectElement;
globalThis.Event = window.Event;

const {default: MetroSelect} = await import('../metro-select.js');

describe('MetroSelect', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <select aria-label="Example">
                <option value="one">One</option>
                <option class="removeable removed" value="two">Two</option>
            </select>`;
    });

    test('renders safely and synchronizes the native select', () => {
        const select = document.querySelector('select');
        let changedTo;
        const metroSelect = new MetroSelect(select, {
            onChange: (value) => changedTo = value,
        });

        metroSelect.select('two');

        expect(select.value).toBe('two');
        expect(changedTo).toBe('two');
        expect(metroSelect.element.querySelector('[data-value="two"]')?.getAttribute('aria-selected')).toBe('true');
    });

    test('matches exact option values', () => {
        const metroSelect = new MetroSelect(document.querySelector('select'));

        metroSelect.select('missing');

        expect(metroSelect.selectElement.value).toBe('one');
    });

    test('only changes visibility after confirmation', () => {
        const metroSelect = new MetroSelect(document.querySelector('select'), {
            onVisibilityChange: (_value, _visible, confirm) => confirm(false),
        });
        const entry = metroSelect.options.get('two');

        entry.addButton.click();

        expect(entry.addButton.hidden).toBeFalse();
        expect(entry.removeButton.hidden).toBeTrue();
    });

    test('changes visibility after confirmation', () => {
        const metroSelect = new MetroSelect(document.querySelector('select'));
        const entry = metroSelect.options.get('two');

        entry.addButton.click();

        expect(entry.addButton.hidden).toBeTrue();
        expect(entry.removeButton.hidden).toBeFalse();
        expect(entry.label.classList.contains('metroselect-added')).toBeTrue();
    });

    test('tracks native select changes without emitting another change', () => {
        const select = document.querySelector('select');
        let changes = 0;
        select.addEventListener('change', () => changes++);
        const metroSelect = new MetroSelect(select);

        select.value = 'two';
        select.dispatchEvent(new Event('change', {bubbles: true}));

        expect(changes).toBe(1);
        expect(metroSelect.options.get('two').label.getAttribute('aria-selected'))
            .toBe('true');
    });

    test('restores the native select when destroyed', () => {
        const select = document.querySelector('select');
        const metroSelect = new MetroSelect(select);

        metroSelect.destroy();

        expect(select.hidden).toBeFalse();
        expect(metroSelect.element.isConnected).toBeFalse();
    });

    test('preserves an originally hidden select when destroyed', () => {
        const select = document.querySelector('select');
        select.hidden = true;
        const metroSelect = new MetroSelect(select);

        metroSelect.destroy();

        expect(select.hidden).toBeTrue();
    });

    test('rejects non-select elements', () => {
        expect(() => new MetroSelect(document.createElement('div')))
            .toThrow(TypeError);
    });
});
