import { useRef } from "react";

export function useThrowingTransformTrackValue<
	T,
	TransformedValue,
	DefaultValue = undefined,
>(
	valueToTrack: T,
	transformFn: (value: T) => TransformedValue,
	defaultValue: DefaultValue = undefined as DefaultValue,
) {
	const transformedValue = useRef<DefaultValue | TransformedValue>(
		defaultValue,
	);

	try {
		transformedValue.current = transformFn(valueToTrack);
	} catch {}

	return transformedValue.current;
}
