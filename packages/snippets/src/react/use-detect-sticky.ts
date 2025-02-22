import { useEffect, useState } from "react";

export default function useDetectSticky(
  ref: React.RefObject<HTMLElement | null>,
) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const cachedRef = ref.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        setIsSticky(e.intersectionRatio < 1);
      },
      { threshold: 1 },
    );

    observer.observe(cachedRef);

    return () => observer.unobserve(cachedRef);
  }, [ref.current]);

  return isSticky;
}
