import { type RefObject, useEffect, useState } from "react";

export default function useScrollThreshold(
  threshold: number,
  ref: RefObject<HTMLElement | null> | null,
) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (ref && !ref.current) return;

    const updatePosition = () => {
      const scroll = ref ? (ref.current?.scrollTop ?? 0) : window.scrollY;
      setIsScrolled(scroll > threshold);
    };

    const element: GlobalEventHandlers = ref?.current ?? window;
    element.addEventListener("scroll", updatePosition);

    updatePosition();
    return () => element.removeEventListener("scroll", updatePosition);
  }, [threshold, ref]);

  return isScrolled;
}
