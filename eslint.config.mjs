import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettierConfig, // Desactiva reglas que chocan con Prettier
    {
        plugins: {
            prettier,
        },
        rules: {
            'prettier/prettier': 'warn',
            quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
            'jsx-quotes': ['error', 'prefer-single'],
            // ... tus otras reglas
        },
    },
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
