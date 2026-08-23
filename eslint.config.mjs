import js from '@eslint/js';
import globals from 'globals';

export default [
    {ignores: ['node_modules/**']},
    {
        files: ['**/*.js'],
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {...globals.browser, Bun: 'readonly'},
        },
        rules: {
            eqeqeq: ['error', 'always'],
            'no-console': 'off',
            'no-var': 'error',
            'prefer-const': 'error',
        },
    },
];
