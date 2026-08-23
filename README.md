# Metro Select

An accessible, dependency-free enhancement for native select elements, inspired by Zune.

```js
import MetroSelect from 'metro-select';
import 'metro-select/metro-select.css';

const metroSelect = new MetroSelect(document.querySelector('select'), {
    initial: 'first-option',
    onChange: (value) => console.log(value),
});
```

Metro Select keeps the original `<select>` synchronized and dispatches native `change` events. Run `bun run check` to lint and test the package.

Version 3 removes the jQuery plugin API used by version 2.
