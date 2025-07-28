import { useEffect, useMemo, useState } from "react";
import { useTrackValue } from "./use-track-value";

export default function Component() {
	const [page, setPage] = useState<number>(0);
	const query = useQuery(fetch, page);

	return (
		<div>
			<button onClick={() => setPage((page) => page - 1)}>back page</button>
			<button onClick={() => setPage((page) => page + 1)}>forward page</button>
			<p>this raw output: {query.data}</p>
			<p>
				track value output with Boolean: {useTrackValue(query.data, Boolean)}
			</p>
		</div>
	);
}

function fetch(page: number) {
	return new Promise<string>((resolve) =>
		setTimeout(() => {
			resolve(`Successfully fetched page ${page}`);
		}, 2000),
	);
}

// naïve impl - do not use this in production code
function useQuery<T, Params>(
	query: (params: Params) => Promise<T>,
	params: Params,
) {
	const [apiCallStore, setApiCallStore] = useState<Record<string, T>>({});
	const stringifiedParams = useMemo(() => JSON.stringify(params), [params]);

	useEffect(() => {
		if (stringifiedParams in apiCallStore) return;
		query(params).then((result) =>
			setApiCallStore((store) => ({ ...store, [stringifiedParams]: result })),
		);
	}, [stringifiedParams]);

	if (stringifiedParams in apiCallStore) {
		return { isLoading: false, data: apiCallStore[stringifiedParams] };
	}

	return { isLoading: true, data: null };
}
