import { useRef } from "react";
import useDetectSticky from "./use-detect-sticky";

export default function Component() {
	const element = useRef<HTMLDivElement>(null);
	const hasScrolled = useDetectSticky(element);

	return (
		<div className="overflow-y-auto h-[500px]">
			{/* -top-px is important */}
			<div className="sticky -top-px" ref={element}>
				{hasScrolled && "You've scrolled"}
			</div>
		</div>
	);
}
