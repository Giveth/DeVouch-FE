import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import importX from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import unusedImports from 'eslint-plugin-unused-imports';
import pluginQuery from '@tanstack/eslint-plugin-query';
import tseslint from 'typescript-eslint';

export default defineConfig([
	globalIgnores(['.next/**', 'node_modules/**', 'next-env.d.ts']),
	...nextCoreWebVitals,
	...pluginQuery.configs['flat/recommended'],
	prettierRecommended,
	{
		// Same file scope as eslint-config-next, so plugin-scoped rules only apply
		// where those plugins are registered.
		files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
		languageOptions: {
			// eslint-config-next's default (Babel-based) parser is not compatible
			// with ESLint 10; parse everything with the TypeScript parser instead,
			// as the previous .eslintrc did.
			parser: tseslint.parser,
		},
		plugins: {
			// eslint-plugin-import-x replaces eslint-plugin-import for our own
			// rules: the original plugin's `order` autofix still calls an API that
			// ESLint 10 removed. (eslint-config-next keeps registering `import/*`.)
			'import-x': importX,
			'unused-imports': unusedImports,
		},
		settings: {
			// eslint-plugin-react's automatic version detection uses an API that
			// no longer exists in ESLint 10, so declare the React version explicitly.
			react: { version: '19.3' },
			'import-x/resolver-next': [createTypeScriptImportResolver()],
		},
		rules: {
			'react/no-unescaped-entities': 'warn',
			// New React Compiler-derived rules shipped in eslint-plugin-react-hooks v7.
			// They flag pre-existing patterns (refs read during render, setState in
			// effects). Kept visible as warnings until those components are refactored.
			'react-hooks/refs': 'warn',
			'react-hooks/set-state-in-effect': 'warn',
			'react-hooks/immutability': 'warn',
			'import-x/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						['internal', 'parent', 'sibling'],
						'index',
						'object',
						'type',
					],
				},
			],
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto',
				},
			],
			'import-x/named': 'error',
			'import-x/no-duplicates': ['error', { considerQueryString: true }],
		},
	},
]);
