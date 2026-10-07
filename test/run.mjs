// Runs every `src/**/*.test.ts` file with Node's test runner, loading the
// TypeScript through tsx. The files are listed here because `node --test`
// only accepts glob patterns from Node 21, and engines.node allows 20.19.
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';

const files = readdirSync('src', { recursive: true })
	.filter(file => file.endsWith('.test.ts'))
	.map(file => path.join('src', file));

if (files.length === 0) {
	console.error('No test files found under src/');
	process.exit(1);
}

const { status } = spawnSync(
	process.execPath,
	['--import', 'tsx', '--test', ...files],
	{ stdio: 'inherit' },
);
process.exit(status ?? 1);
