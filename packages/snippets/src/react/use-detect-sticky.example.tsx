import React, { useRef } from "react";
import useDetectSticky from "./use-detect-sticky";

export default function Component() {
	const element = useRef<HTMLDivElement>(null);
	const hasScrolled = useDetectSticky(element);

	return (
		<div className="overflow-y-auto h-[250px] text-balance">
			<p>Try scrolling...</p>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec sem
				at libero fermentum ultricies nec ac magna. Interdum et malesuada fames
				ac ante ipsum primis in faucibus.
			</p>
			<div
				// !	-top-px required
				className="sticky -top-px bg-stone-800 px-4 py-1 rounded-full w-fit"
				ref={element}
			>
				{hasScrolled ? "Scrolled past sticky element" : "Sticky element"}
			</div>
			<p>
				Integer vitae sem molestie, lobortis purus a, hendrerit enim. Mauris
				massa erat, iaculis at semper nec, placerat sit amet odio. Curabitur
				tempor felis urna, vitae consectetur nisi venenatis eget. Phasellus
				eleifend, nunc id volutpat venenatis, dui sem pharetra magna, ac auctor
				eros orci ac orci. Sed diam libero, suscipit quis lorem convallis,
				euismod dictum nibh. Mauris euismod vehicula rhoncus. Sed sollicitudin
				dignissim leo ac efficitur. Sed vel sem rhoncus, feugiat massa nec,
				consectetur mi. Vivamus accumsan vulputate luctus. Cras imperdiet
				blandit diam, nec fermentum eros. Vestibulum ac tortor a tellus pharetra
				placerat. Mauris vel mollis dui. Sed pellentesque metus sed justo dictum
				ultrices. Etiam ipsum magna, tempor convallis tempus id, tristique a
				massa.
			</p>
		</div>
	);
}
