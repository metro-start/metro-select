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

## Build and test

Metro Select ships as dependency-free source, so no compilation step is
required. Bun 1.4 or newer is required for development.

```sh
bun install --frozen-lockfile
bun run check
```

Open `sample.html` directly to run the demo. To publish version 3.1.0, verify
the version in `package.json`, run the checks above, and then run
`bun publish` with npm registry credentials configured.

Version 3 removes the jQuery plugin API used by version 2. Version 3.1 keeps
the generated control synchronized when code changes the native select.
