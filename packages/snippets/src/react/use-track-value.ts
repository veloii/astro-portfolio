import { useRef } from "react";

export function useTrackValue<T>(
	valueToTrack: T,
	conditionFn: (value: T) => unknown,
) {
	const transformedValue = useRef<T>(valueToTrack);

	if (conditionFn(valueToTrack)) {
		transformedValue.current = valueToTrack;
	}

	return transformedValue.current;
}
