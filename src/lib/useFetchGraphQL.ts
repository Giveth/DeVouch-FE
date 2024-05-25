import { useState, useEffect, useCallback } from 'react';
import { fetchGraphQL } from '@/helpers/request';

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
