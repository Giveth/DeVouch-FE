export const fetchGraphQL = async <T>(
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
