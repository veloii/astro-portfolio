import { z } from "zod";
import { useThrowingTransformTrackValue } from "./use-throwing-transform-track-value";
import { useState } from "react";

export default function Component() {
	const [searchQuery, setSearchQuery] = useState<string>();

	const validSearchOptions = useThrowingTransformTrackValue(
		searchQuery,
		z.string().min(1).max(8).parse,
	);

	return (
		<div>
			<input onChange={(e) => setSearchQuery(e.currentTarget.value)} />
			<p>raw output: {searchQuery}</p>
			<p>throwing transform track value output: {validSearchOptions}</p>
		</div>
	);
}
