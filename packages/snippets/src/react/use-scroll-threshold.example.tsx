import { useRef } from "react";
import useScrollThreshold from "./use-scroll-threshold";

export default function Component() {
	const element = useRef<HTMLDivElement>(null);
	const hasScrolled = useScrollThreshold(100, element);

	return (
		<div className="relative">
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				{hasScrolled ? "Detected 100px scroll" : "Try scroll 100px"}
			</div>
			<div className="overflow-y-auto h-[200px]" ref={element}>
				<div className="h-[500px]" />
			</div>
		</div>
	);
}
