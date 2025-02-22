import { useRef } from "react";
import useScrollThreshold from "./use-scroll-threshold";

function Component() {
  const element = useRef<HTMLDivElement>(null);
  const hasScrolled = useScrollThreshold(100, element);

  return (
    <div className="overflow-y-auto h-[200px]" ref={element}>
      <div className="h-[500px] grid place-items-center">
        {hasScrolled && "You've scrolled"}
      </div>
    </div>
  );
}
