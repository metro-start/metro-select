const defaults = Object.freeze({
    initial: '',
    margins: '8px',
    addedClass: 'metroselect-added',
    removedClass: 'metroselect-removed',
    parentAddedClass: 'metroselect-parent-added',
    parentRemovedClass: 'metroselect-parent-removed',
    addText: '+',
    removeText: '×',
    addRemoveClass: 'add-remove',
    activeClass: 'metroselect-active',
    optionClass: 'metroselect-option',
    containerClass: 'metroselect-container',
    guideClass: 'metroselect-guide',
    guideTextLeft: '[',
    guideTextRight: ']',
    onChange: () => {},
    onVisibilityChange: (_value, _visible, confirm) => confirm(true),
});

const addClasses = (element, classes = '') => {
    element.classList.add(...classes.split(/\s+/).filter(Boolean));
};

const removeClasses = (element, classes = '') => {
    element.classList.remove(...classes.split(/\s+/).filter(Boolean));
};

export default class MetroSelect {
    constructor(select, options = {}) {
        if (!(select instanceof HTMLSelectElement)) {
            throw new TypeError('MetroSelect requires an HTMLSelectElement');
        }

        this.selectElement = select;
        this.settings = {...defaults, ...options};
        this.options = new Map();
        this.element = this.createElement('div', this.settings.containerClass);
        this.element.setAttribute('role', 'listbox');
        this.element.setAttribute('aria-label', select.getAttribute('aria-label') || select.name || 'Select an option');
        this.render();
    }

    createElement(tagName, classNames, text) {
        const element = document.createElement(tagName);
        addClasses(element, classNames);
        if (text !== undefined) {
            element.textContent = text;
        }
        return element;
    }

    render() {
        this.element.style.setProperty('--metro-select-margin', this.settings.margins);
        this.element.append(this.createElement('span', this.settings.guideClass, this.settings.guideTextLeft));

        const optionContainer = this.createElement('span', 'metro-select-options');
        for (const option of this.selectElement.options) {
            const value = option.value || option.textContent;
            const wrapper = this.createElement('span', 'metro-select-child');
            const label = this.createElement('button', `metro-select-label ${this.settings.optionClass}`, option.textContent);
            label.type = 'button';
            label.dataset.value = value;
            label.setAttribute('role', 'option');
            label.disabled = option.disabled;
            addClasses(label, option.className);
            label.addEventListener('click', () => this.select(value));
            wrapper.append(label);

            const removable = option.classList.contains('removeable');
            const removed = option.classList.contains('removed');
            if (removable) {
                const addButton = this.createVisibilityButton(this.settings.addText, `Show ${option.textContent}`);
                const removeButton = this.createVisibilityButton(this.settings.removeText, `Hide ${option.textContent}`);
                addButton.addEventListener('click', () => this.requestVisibility(value, true));
                removeButton.addEventListener('click', () => this.requestVisibility(value, false));
                wrapper.append(addButton, removeButton);
                this.options.set(value, {option, wrapper, label, addButton, removeButton});
                this.setVisibility(value, !removed);
            } else {
                this.options.set(value, {option, wrapper, label});
            }
            optionContainer.append(wrapper);
        }

        this.element.append(optionContainer);
        this.element.append(this.createElement('span', this.settings.guideClass, this.settings.guideTextRight));
        this.selectElement.hidden = true;
        this.selectElement.insertAdjacentElement('afterend', this.element);
        this.select(this.settings.initial || this.selectElement.value, {emit: false});
    }

    createVisibilityButton(text, label) {
        const button = this.createElement('button', `metroselect-addremove ${this.settings.addRemoveClass}`, text);
        button.type = 'button';
        button.setAttribute('aria-label', label);
        return button;
    }

    select(value, {emit = true} = {}) {
        const entry = this.options.get(value) || this.options.values().next().value;
        if (!entry) {
            return;
        }

        for (const current of this.options.values()) {
            current.label.classList.toggle(this.settings.activeClass, current === entry);
            current.label.setAttribute('aria-selected', String(current === entry));
        }
        this.selectElement.value = entry.option.value;
        if (emit) {
            this.selectElement.dispatchEvent(new Event('change', {bubbles: true}));
            this.settings.onChange(entry.option.value || entry.option.textContent);
        }
    }

    requestVisibility(value, visible) {
        this.settings.onVisibilityChange(value, visible, (confirmed) => {
            if (confirmed) {
                this.setVisibility(value, visible);
            }
        });
    }

    setVisibility(value, visible) {
        const entry = this.options.get(value);
        if (!entry?.addButton) {
            return;
        }

        entry.addButton.hidden = visible;
        entry.removeButton.hidden = !visible;
        entry.label.classList.toggle(this.settings.addedClass, visible);
        entry.label.classList.toggle(this.settings.removedClass, !visible);
        removeClasses(entry.wrapper, visible ? this.settings.parentRemovedClass : this.settings.parentAddedClass);
        addClasses(entry.wrapper, visible ? this.settings.parentAddedClass : this.settings.parentRemovedClass);
    }

    destroy() {
        this.element.remove();
        this.selectElement.hidden = false;
    }
}
