import { useState, useEffect, useCallback } from 'react';

const fetchGraphQL = async <T>(
	query: string,
	variables: Record<string, any> = {},
): Promise<T> => {
	const response = await fetch('https://backend.devouch.xyz/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust if using different auth method
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	const { data, errors } = await response.json();

	if (errors) {
		throw new Error(errors.map((error: any) => error.message).join(', '));
	}

	return data;
};

const useFetchGraphQL = <T>(
	query: string,
	variables: Record<string, any> = {},
) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(
		async (variables: Record<string, any>) => {
			setLoading(true);
			setError(null);
			try {
				const result = await fetchGraphQL<T>(query, variables);
				setData(result);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[query],
	);

	useEffect(() => {
		fetchData(variables);
	}, [fetchData, variables]);

	return { data, loading, error, refetch: fetchData };
};

export default useFetchGraphQL;
