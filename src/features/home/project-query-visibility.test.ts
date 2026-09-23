import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import {
	generateFetchProjectsByIdsQuery,
	generateFetchProjectsQuery,
	generateGetProjectsSortedByVouchOrFlagQuery,
} from './query-genrator';
import {
	FETCH_PROJECT_ATTESTATIONS,
	FETCH_PROJECT_ATTESTATIONS_TOTAL_COUNT,
	FETCH_PROJECT_BY_ID,
	FETCH_PROJECT_METADATA_BY_ID,
} from '../project/queries';
import {
	FETCH_USER_ATTESTATIONS,
	FETCH_USER_ATTESTATIONS_TOTAL_COUNT,
} from '../profile/queries';

// Repo-wide guard for the `Project.imported` visibility semantics of
// DeVouch-BE #190: a Giveth project that disappears from the v6 catalog is not
// deleted, it gets `imported = false`, and must drop out of discovery while its
// row, attestations and history stay reachable.
//
// `fetch-projects-page.test.ts` pins the behaviour of the listing; this file
// pins the *surface*: every `projects` collection the app can ask the squid API
// for, plus a tripwire so a newly added one has to be classified here rather
// than shipping unfiltered.

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');

// `projects(...)` and `projectsConnection(...)` are the only generated fields
// that return a project collection. Anything else (`projectAttestations`,
// `organisations`) returns attestations or organisations.
const COLLECTION_FIELD = /\bprojects(?:Connection)?\s*\(/g;

// The argument list of one selection, taken by balancing parentheses so nested
// `where: { ... ( ... ) }` text cannot truncate it.
const argumentsAt = (text: string, openIndex: number): string => {
	let depth = 0;
	for (let i = openIndex; i < text.length; i++) {
		if (text[i] === '(') depth++;
		else if (text[i] === ')') {
			depth--;
			if (depth === 0) return text.slice(openIndex + 1, i);
		}
	}
	throw new Error(`Unbalanced parentheses at ${openIndex} in: ${text}`);
};

const projectSelections = (query: string): string[] => {
	const found: string[] = [];
	for (const match of query.matchAll(COLLECTION_FIELD)) {
		found.push(argumentsAt(query, match.index + match[0].length - 1));
	}
	return found;
};

type Verdict =
	| 'filtered' // asks the backend for visible projects only
	| 'single-project-by-id' // detail page, deliberately still reachable
	| 'hydration-by-resolver-ids' // ids already filtered by the custom resolver
	| 'unfiltered-collection'; // would leak hidden projects into a listing

const classify = (args: string): Verdict => {
	if (/\bimported_eq:\s*true\b/.test(args)) return 'filtered';
	if (/\bid_eq:\s*\$id\b/.test(args)) return 'single-project-by-id';
	if (/\bid_in:\s*\$ids\b/.test(args)) return 'hydration-by-resolver-ids';
	return 'unfiltered-collection';
};

// Every project collection the app can send, including each shape the explore
// query generator emits for the filter combinations the UI can produce.
const generatorVariants: [
	string,
	Parameters<typeof generateFetchProjectsQuery>,
][] = [
	['no filters', []],
	['search term', [[], [], 'solar']],
	['non-rf sources', [['giveth', 'gitcoin']]],
	['rf rounds', [['rf5'], [], '', [5]]],
	['rf + non-rf sources', [['giveth', 'rf4'], [], '', [4]]],
	['organisation', [[], ['org-1']]],
	['everything', [['giveth', 'rf5'], ['org-1'], 'solar', [5]]],
];

const inventory: [string, string, Verdict][] = [
	...generatorVariants.map(
		([name, args]) =>
			[
				`explore listing (${name})`,
				generateFetchProjectsQuery(...args),
				'filtered',
			] as [string, string, Verdict],
	),
	[
		'explore listing, organisation filter - hydration of resolver ids',
		generateFetchProjectsByIdsQuery(),
		'hydration-by-resolver-ids',
	],
	['project detail', FETCH_PROJECT_BY_ID, 'single-project-by-id'],
	[
		'project detail metadata',
		FETCH_PROJECT_METADATA_BY_ID,
		'single-project-by-id',
	],
];

describe('project collection queries', () => {
	for (const [name, query, expected] of inventory) {
		it(`${name} is ${expected}`, () => {
			const selections = projectSelections(query);
			assert.ok(
				selections.length > 0,
				`${name} selects no project collection`,
			);
			for (const args of selections) {
				assert.equal(
					classify(args),
					expected,
					`${name} selects projects(${args})`,
				);
			}
		});
	}

	// The organisation branch is the one listing path whose visibility is not
	// enforced by its own `where`: it pages over ids from the custom resolver,
	// which filters `project.imported = true` server-side
	// (DeVouch-BE src/server-extension/project-resolver.ts), then hydrates
	// exactly those ids. Nothing is filtered client-side, so the resolver's
	// paging stays intact - and no `imported` filter is layered on top.
	it('the organisation resolver query carries no client-side visibility filter', () => {
		const query = generateGetProjectsSortedByVouchOrFlagQuery();
		assert.doesNotMatch(query, /imported/);
		assert.match(query, /getProjectsSortedByVouchOrFlag\(/);
		assert.equal(projectSelections(query).length, 0);
	});

	// #190 preserves attestations, vouches, flags and counters for a hidden
	// project. These list attestations, not projects, so filtering them on the
	// project's visibility would delete history from the UI - which is why they
	// deliberately carry no `imported` condition.
	it('attestation history queries stay unfiltered', () => {
		for (const query of [
			FETCH_PROJECT_ATTESTATIONS,
			FETCH_PROJECT_ATTESTATIONS_TOTAL_COUNT,
			FETCH_USER_ATTESTATIONS,
			FETCH_USER_ATTESTATIONS_TOTAL_COUNT,
		]) {
			assert.doesNotMatch(query, /imported/);
			assert.equal(projectSelections(query).length, 0);
		}
	});
});

// Tripwire: the inventory above is only exhaustive while these are the only
// files that select a project collection. A new listing, search or discovery
// query anywhere else fails here until it is classified above.
describe('project collection query surface', () => {
	const sourceFiles = (dir: string): string[] =>
		readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) return sourceFiles(full);
			return /\.tsx?$/.test(entry.name) &&
				!entry.name.endsWith('.test.ts')
				? [full]
				: [];
		});

	// Prose mentions project collections too ("Hidden projects (imported =
	// false) ..."), so comments are dropped before the scan; no GraphQL query
	// text contains a comment marker.
	const stripComments = (source: string) =>
		source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

	it('is limited to the query modules covered above', () => {
		const selecting = sourceFiles(SRC)
			.filter(file => {
				COLLECTION_FIELD.lastIndex = 0;
				return COLLECTION_FIELD.test(
					stripComments(readFileSync(file, 'utf8')),
				);
			})
			.map(file => path.relative(SRC, file))
			.sort();

		assert.deepEqual(selecting, [
			'features/home/query-genrator.ts',
			'features/project/queries.ts',
		]);
	});
});
