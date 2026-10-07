import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	fetchProjectsPage,
	PROJECTS_PAGE_SIZE,
	type GraphQLRequest,
	type IProjectsPageParams,
} from './fetch-projects-page';
import {
	generateFetchProjectsQuery,
	generateGetProjectsSortedByVouchOrFlagQuery,
} from './query-genrator';
import {
	FETCH_PROJECT_BY_ID,
	FETCH_PROJECT_METADATA_BY_ID,
} from '../project/queries';

// `imported = false` marks a project hidden from discovery (e.g. a Giveth
// project deactivated upstream, DeVouch-BE #190) while keeping its row and
// attestations. These tests pin that every explore-listing path asks the
// backend to exclude such projects, so pagination runs over visible projects.

interface IRow {
	id: string;
	title: string;
	source: string;
	rfRounds: number[] | null;
	imported: boolean;
	totalVouches: number;
	organisations: string[];
}

const row = (n: number, overrides: Partial<IRow> = {}): IRow => ({
	id: `giveth-${n}`,
	title: `Project ${n}`,
	source: 'giveth',
	rfRounds: null,
	imported: true,
	totalVouches: 1000 - n,
	organisations: [],
	...overrides,
});

// The `where` clause of a generated `projects` query, split into the part every
// row must satisfy and the optional source/round OR group - the shape
// `generateFetchProjectsQuery` emits.
const splitWhere = (query: string) => {
	const where = query.slice(query.indexOf('where:'), query.lastIndexOf(')'));
	const grouped = where.match(/AND: \[\{ (.*?) \}, \{ OR: \[(.*)\] \}\] \}/s);
	return grouped
		? { required: grouped[1], sourceGroup: grouped[2] }
		: { required: where, sourceGroup: '' };
};

// In-memory stand-in for the squid GraphQL API. It honours only the filters
// the query text actually asks for, so a query that forgets
// `imported_eq: true` (or buries it in the OR group) returns hidden rows here
// exactly as it would against the real `projects` query.
const fakeBackend = (rows: IRow[]) => {
	const calls: { query: string; variables: Record<string, any> }[] = [];

	const request: GraphQLRequest = async <T>(
		query: string,
		variables: Record<string, any>,
	): Promise<T> => {
		calls.push({ query, variables });
		const toProject = (r: IRow) => ({ ...r, projectId: r.id });

		if (query.includes('getProjectsSortedByVouchOrFlag(')) {
			// DeVouch-BE's custom resolver filters `project.imported = true`
			// server-side (src/server-extension/project-resolver.ts).
			const ids = rows
				.filter(r => r.imported)
				.filter(r =>
					r.organisations.some(o =>
						variables.organizations.includes(o),
					),
				)
				.sort((a, b) => b.totalVouches - a.totalVouches)
				.slice(variables.offset, variables.offset + variables.limit)
				.map(r => ({ id: r.id }));
			return { getProjectsSortedByVouchOrFlag: ids } as T;
		}

		if (query.includes('fetchProjectsByIds')) {
			return {
				projects: rows
					.filter(r => variables.ids.includes(r.id))
					.map(toProject),
			} as T;
		}

		const { required, sourceGroup } = splitWhere(query);
		let result = rows;
		if (required.includes('imported_eq: true')) {
			result = result.filter(r => r.imported);
		}
		if (required.includes('title_containsInsensitive: $term')) {
			const term = String(variables.term).toLowerCase();
			result = result.filter(r => r.title.toLowerCase().includes(term));
		}
		if (required.includes('attestedOrganisations_some')) {
			result = result.filter(r =>
				r.organisations.some(o =>
					variables.organisation_id.includes(o),
				),
			);
		}
		if (sourceGroup) {
			result = result.filter(
				r =>
					(sourceGroup.includes('source_in: $non_rf_sources') &&
						variables.non_rf_sources.includes(r.source)) ||
					(sourceGroup.includes('rfRounds_containsAny: $rf_rounds') &&
						(r.rfRounds ?? []).some(round =>
							variables.rf_rounds.includes(round),
						)),
			);
		}
		const [field, direction] = String(variables.orderBy[0]).split('_');
		const sign = direction === 'ASC' ? 1 : -1;
		result = [...result].sort(
			(a, b) =>
				sign *
				(Number(a[field as keyof IRow]) -
					Number(b[field as keyof IRow])),
		);
		return {
			projects: result
				.slice(variables.offset, variables.offset + variables.limit)
				.map(toProject),
		} as T;
	};

	return { request, calls };
};

const params = (
	overrides: Partial<IProjectsPageParams> = {},
): IProjectsPageParams => ({
	sourceParams: [],
	organisationParams: [],
	sortParam: 'totalVouches_DESC',
	termParam: '',
	...overrides,
});

// Walks the listing the way the "Load More" button does.
const collectAllPages = async (
	request: GraphQLRequest,
	pageParams: IProjectsPageParams,
) => {
	const pages = [];
	let pageParam: number | undefined = 0;
	while (pageParam !== undefined) {
		const page = await fetchProjectsPage(request, pageParams, pageParam);
		pages.push(page);
		pageParam = page.nextPage;
	}
	return pages;
};

const ids = (projects: { id: string }[]) => projects.map(p => p.id);

describe('generateFetchProjectsQuery', () => {
	const variants: [string, Parameters<typeof generateFetchProjectsQuery>][] =
		[
			['no filters', []],
			['search term', [[], [], 'solar']],
			['non-rf sources', [['giveth', 'gitcoin']]],
			['rf rounds', [['rf5'], [], '', [5]]],
			['rf + non-rf sources', [['giveth', 'rf4'], [], '', [4]]],
			['organisation', [[], ['org-1']]],
			['everything', [['giveth', 'rf5'], ['org-1'], 'solar', [5]]],
		];

	for (const [name, args] of variants) {
		it(`requires imported_eq: true on every row (${name})`, () => {
			const { required, sourceGroup } = splitWhere(
				generateFetchProjectsQuery(...args),
			);
			assert.match(required, /\bimported_eq: true\b/);
			// Inside the OR group it would only constrain one branch.
			assert.doesNotMatch(sourceGroup, /imported/);
		});
	}
});

describe('fetchProjectsPage - projects listing', () => {
	it('shows imported=true projects and never imported=false ones', async () => {
		const { request } = fakeBackend([
			row(1),
			row(2, { imported: false }),
			row(3),
		]);
		const page = await fetchProjectsPage(request, params());
		assert.deepEqual(ids(page.projects), ['giveth-1', 'giveth-3']);
	});

	it('does not return imported=false projects from search', async () => {
		const { request, calls } = fakeBackend([
			row(1, { title: 'Solar Schools' }),
			row(2, { title: 'Solar Farms', imported: false }),
			row(3, { title: 'Clean Water' }),
		]);
		const page = await fetchProjectsPage(
			request,
			params({ termParam: 'solar' }),
		);
		assert.deepEqual(ids(page.projects), ['giveth-1']);
		assert.equal(calls[0].variables.term, 'solar');
	});

	it('does not return imported=false projects from source filters', async () => {
		const { request } = fakeBackend([
			row(1),
			row(2, { imported: false }),
			row(3, { source: 'rf', rfRounds: [5] }),
			row(4, { source: 'rf', rfRounds: [5], imported: false }),
			row(5, { source: 'gitcoin' }),
		]);
		const page = await fetchProjectsPage(
			request,
			params({ sourceParams: ['giveth', 'rf5'] }),
		);
		assert.deepEqual(ids(page.projects), ['giveth-1', 'giveth-3']);
	});

	it('paginates over visible projects, with full pages and no gaps', async () => {
		// Every third project is hidden, interleaved through the sort order.
		const rows = Array.from({ length: 75 }, (_, i) =>
			row(i + 1, { imported: (i + 1) % 3 !== 0 }),
		);
		const visible = rows.filter(r => r.imported).map(r => r.id);
		const { request, calls } = fakeBackend(rows);

		const pages = await collectAllPages(request, params());

		// Pagination is delegated to the backend: each request pages with the
		// plain offset/limit, nothing is fetched to be discarded client-side.
		assert.deepEqual(
			calls.map(c => [c.variables.offset, c.variables.limit]),
			[
				[0, PROJECTS_PAGE_SIZE],
				[20, PROJECTS_PAGE_SIZE],
				[40, PROJECTS_PAGE_SIZE],
			],
		);
		assert.deepEqual(
			pages.map(p => p.projects.length),
			[20, 20, visible.length - 40],
		);
		assert.deepEqual(ids(pages.flatMap(p => p.projects)), visible);
		assert.equal(pages.at(-1)?.nextPage, undefined);
	});

	it('reports an empty result when only hidden projects match', async () => {
		const { request } = fakeBackend([
			row(1, { title: 'Solar Farms', imported: false }),
		]);
		const page = await fetchProjectsPage(
			request,
			params({ termParam: 'solar' }),
		);
		assert.deepEqual(page, { projects: [], nextPage: undefined });
	});
});

describe('fetchProjectsPage - organisation listing (getProjectsSortedByVouchOrFlag)', () => {
	it('keeps sending the unchanged resolver query and variables', async () => {
		const { request, calls } = fakeBackend([
			row(1, { organisations: ['org-1'] }),
		]);
		await fetchProjectsPage(
			request,
			params({
				organisationParams: ['org-1'],
				sourceParams: ['giveth', 'rf5'],
				sortParam: 'totalFlags_DESC',
			}),
			40,
		);
		assert.equal(
			calls[0].query,
			generateGetProjectsSortedByVouchOrFlagQuery(),
		);
		assert.deepEqual(calls[0].variables, {
			organizations: ['org-1'],
			sortBy: 'totalFlags_DESC',
			limit: PROJECTS_PAGE_SIZE,
			offset: 40,
			sources: ['rf', 'giveth'],
			rfRounds: [5],
		});
		// The resolver already filters imported = true, so no extra filter is
		// layered on it.
		assert.doesNotMatch(calls[0].query, /imported/);
	});

	it('lists what the resolver returns, in its order, across pages', async () => {
		const rows = Array.from({ length: 45 }, (_, i) =>
			row(i + 1, {
				organisations: ['org-1'],
				imported: (i + 1) % 4 !== 0,
			}),
		);
		const visible = rows.filter(r => r.imported).map(r => r.id);
		const { request } = fakeBackend(rows);

		const pages = await collectAllPages(
			request,
			params({ organisationParams: ['org-1'] }),
		);

		assert.deepEqual(
			pages.map(p => p.projects.length),
			[20, visible.length - 20],
		);
		assert.deepEqual(ids(pages.flatMap(p => p.projects)), visible);
	});
});

describe('project detail queries', () => {
	it('still fetch a single project by id without an imported filter', () => {
		// Hidden projects keep their attestations and history (#190), so the
		// detail page stays reachable by id.
		for (const query of [
			FETCH_PROJECT_BY_ID,
			FETCH_PROJECT_METADATA_BY_ID,
		]) {
			assert.match(query, /projects\(where: \{id_eq: \$id\}\)/);
			assert.doesNotMatch(query, /imported/);
		}
	});
});
